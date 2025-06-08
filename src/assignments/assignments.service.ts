import { Injectable, Inject, BadRequestException } from '@nestjs/common';
// import { CreateAssignmentDto } from './dto/create-assignment.dto';
// import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { DRIZZLE } from 'src/database/database.module';
import { DrizzleDB } from 'src/database/types/database';
import {
  trucks,
  areas,
  resources,
  truckResource,
  travelTimeToArea,
  assignments,
} from 'src/database/schema/schema';
import { asc, desc, eq, inArray } from 'drizzle-orm';
import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

export interface AssignmentResult {
  areaId: string;
  truckId: string | null;
  resourceDelivered: {
    resourceType: string;
    quantity: number;
  }[];
  status:
  | 'assigned'
  | 'not_suitable_truck'
  | 'insufficient_resources'
  | 'time_constraints_failed';
}
// Define the Area and Truck interfaces
export interface Area {
  areaId: string;
  urgencyLevel: number;
  timeConstraints: number;
  isAssigned: boolean;
  resourceRequirements: {
    resourceType: string;
    quantity: number;
  }[];
}
export interface Truck {
  truckId: string;
  isAssigned: boolean;
  resources: {
    resourceType: string;
    quantity: number;
  }[];
  travelTimeToAreaId: {
    areaId: string;
    time: number;
  }[];
}

@Injectable()
export class AssignmentsService {
  private keyv: Keyv;

  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {
    // Initialize Keyv with Redis
    this.keyv = new Keyv({
      store: new KeyvRedis(process.env.REDIS_URL),
    });
    // Handling Redis connection error
    this.keyv.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }
  async createAssignment(): Promise<AssignmentResult[]> {
    return await this.db.transaction(async (tx) => {
      // Urgency base priority - area
      const pendingAreas = await this.getPendingAreas(tx);
      if (pendingAreas.length === 0) {
        throw new BadRequestException('No pending areas to assign.');
      }
      // Highest urgency area first
      const results: AssignmentResult[] = [];
      for (const area of pendingAreas) {
        // Find suitable truck that can handle the resource requirements and time constraints
        const availableTrucks = await this.getAvailableTrucks(tx);
        // Create assignment
        const assignment = await this.assignTruckToArea(
          tx,
          area,
          availableTrucks,
        );
        // if assignment is successful, update area and truck status
        if (assignment.status === 'assigned') {
          await this.saveAssignmentResult(tx, assignment);
          await this.markAreaAsAssigned(tx, area.areaId);
          await this.markTruckAsAssigned(tx, assignment.truckId!);
          // Cache with redis
          await this.keyv.set('latest_assignment', assignment, 30 * 60 * 1000);
          // Cache for 30 minutes
        }
        results.push(assignment);
      }
      return results;
    });
  }
  async getLatestAssignment(): Promise<AssignmentResult | null> {
    const latest = (await this.keyv.get(
      'latest_assignment',
    )) as AssignmentResult | null;
    if (!latest) {
      throw new BadRequestException('No latest assignment found.');
    }
    console.log('Fetched from Redis:', latest);
    return latest ?? null;
  }
  async clearAssignment() {
    await this.keyv.delete('latest_assignment');
    return 'Assignment cleared';
  }
  async getPendingAreas(tx: DrizzleDB): Promise<Area[]> {
    // Get all pending areas
    const pendingAreas = await tx
      .select()
      .from(areas)
      .where(eq(areas.isAssigned, false))
      .orderBy(desc(areas.urgencyLevel), asc(areas.createdAt));

    // Get all resource requirements for these areas
    const areaIds = pendingAreas.map((area) => area.areaId);
    const requirements = await tx
      .select()
      .from(resources)
      .where(inArray(resources.areaId, areaIds));

    // Group requirements by areaId
    const requirementsByArea: Record<
      string,
      { resourceType: string; quantity: number }[]
    > = {};
    for (const req of requirements) {
      if (!requirementsByArea[req.areaId]) {
        requirementsByArea[req.areaId] = [];
      }
      requirementsByArea[req.areaId].push({
        resourceType: req.resourceType,
        quantity: req.quantity,
      });
    }

    // Combine area info with requirements
    return pendingAreas.map((area) => ({
      ...area,
      resourceRequirements: requirementsByArea[area.areaId] || [],
    }));
  }
  async getAvailableTrucks(tx: DrizzleDB): Promise<Truck[]> {
    const availableTrucks = await tx
      .select()
      .from(trucks)
      .where(eq(trucks.isAssigned, false));
    const truckIds = availableTrucks.map((truck) => truck.truckId);
    const resources = await tx
      .select()
      .from(truckResource)
      .where(inArray(truckResource.truckId, truckIds));
    const travelTimes = await tx
      .select()
      .from(travelTimeToArea)
      .where(inArray(travelTimeToArea.truckId, truckIds))
      .orderBy(asc(travelTimeToArea.truckId));
    // Group resources by truckId
    const resourcesByTruck: Record<
      string,
      { resourceType: string; quantity: number }[]
    > = {};
    for (const res of resources) {
      if (!resourcesByTruck[res.truckId]) {
        resourcesByTruck[res.truckId] = [];
      }
      resourcesByTruck[res.truckId].push({
        resourceType: res.resourceType,
        quantity: res.quantity,
      });
    }
    // Group travel times by truckId
    const travelTimesByTruck: Record<
      string,
      { areaId: string; time: number }[]
    > = {};
    for (const time of travelTimes) {
      if (!travelTimesByTruck[time.truckId]) {
        travelTimesByTruck[time.truckId] = [];
      }
      travelTimesByTruck[time.truckId].push({
        areaId: time.areaId,
        time: time.time,
      });
    }
    // Combine truck info with resources and travel times
    return availableTrucks.map((truck) => ({
      ...truck,
      resources: resourcesByTruck[truck.truckId] || [],
      travelTimeToAreaId: travelTimesByTruck[truck.truckId] || [],
    }));
  }
  // use current all area that not assigned, and all available trucks
  async assignTruckToArea(
    tx: DrizzleDB,
    area: Area,
    availableTrucks: Truck[],
  ): Promise<AssignmentResult> {
    if (availableTrucks.length === 0) {
      return {
        areaId: area.areaId,
        truckId: null,
        resourceDelivered: [],
        status: 'not_suitable_truck',
      };
      // No Input Trucks
      // Can Set to be error
      // throw new BadRequestException('No available trucks.');
    }
    // Find suitable truck
    const suitableTruck = availableTrucks.filter((truck) => {
      // check resource requirements
      const fulfilledResources = area.resourceRequirements.every((required) => {
        const truckResource = truck.resources.find(
          (res) => res.resourceType === required.resourceType,
        );
        return truckResource && truckResource.quantity >= required.quantity;
      });
      if (!fulfilledResources) {
        return false;
      }
      // check time constraints
      const travelTime = truck.travelTimeToAreaId.find(
        (t) => t.areaId === area.areaId,
      );
      if (!travelTime) {
        return false;
      }
      return travelTime.time <= area.timeConstraints;
    });
    if (suitableTruck.length === 0) {
      return {
        areaId: area.areaId,
        truckId: null,
        resourceDelivered: [],
        status: 'not_suitable_truck',
      };
      // throw new BadRequestException('No available trucks.');
    }
    // Assign the first suitable truck
    const assignedTruck = suitableTruck[0];
    // Check if truck has enough resources
    const resourceDelivered = area.resourceRequirements.map((required) => {
      const truckResource = assignedTruck.resources.find(
        (res) => res.resourceType === required.resourceType,
      );
      if (truckResource && truckResource.quantity >= required.quantity) {
        return {
          resourceType: required.resourceType,
          quantity: required.quantity,
        };
      } else {
        throw new Error(`
          Truck does not have enough resources for ${required.resourceType}`);
      }
    });
    // Update area and truck status
    await tx
      .update(areas)
      .set({ isAssigned: true })
      .where(eq(areas.areaId, area.areaId));
    await tx
      .update(trucks)
      .set({ isAssigned: true })
      .where(eq(trucks.truckId, assignedTruck.truckId));
    // Return assignment result
    return {
      areaId: area.areaId,
      truckId: assignedTruck.truckId,
      resourceDelivered: resourceDelivered,
      status: 'assigned',
    };
  }
  async saveAssignmentResult(
    tx: DrizzleDB,
    assignmentResult: AssignmentResult,
  ) {
    await tx.insert(assignments).values({
      areaId: assignmentResult.areaId,
      truckId: assignmentResult.truckId ?? undefined,
      resourceDelivered: JSON.stringify(assignmentResult.resourceDelivered),
    });
  }
  async markAreaAsAssigned(tx: DrizzleDB, areaId: string) {
    await tx
      .update(areas)
      .set({ isAssigned: true })
      .where(eq(areas.areaId, areaId));
  }
  async markTruckAsAssigned(tx: DrizzleDB, truckId: string) {
    await tx
      .update(trucks)
      .set({ isAssigned: true })
      .where(eq(trucks.truckId, truckId));
  }
}

// solve type issue /
// area, truck /
// combine to main logic /
// test logic
// set redis for fetching latest assignment
