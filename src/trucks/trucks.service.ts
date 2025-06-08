import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
// import { UpdateTruckDto } from './dto/update-truck.dto';
import { DRIZZLE } from 'src/database/database.module';
import { DrizzleDB } from 'src/database/types/database';
import {
  trucks,
  truckResource,
  travelTimeToArea,
  areas,
} from 'src/database/schema/schema';
import { inArray } from 'drizzle-orm';

@Injectable()
export class TrucksService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
  async create(createTruckDto: CreateTruckDto) {
    return await this.db.transaction(async (tx) => {
      // Check if truck already exists
      const existingTruck = await tx
        .select()
        .from(trucks)
        .where(inArray(trucks.truckId, [createTruckDto.truckId]))
        .limit(1);
      // Handle case where truck already exists
      if (existingTruck.length > 0) {
        throw new NotFoundException(
          `Truck with ID ${createTruckDto.truckId} already exists.`,
        );
      }
      // Check if area IDs exist
      const areaIds = createTruckDto.travelTimeToAreaId.map(
        (travelTime) => travelTime.areaId,
      );
      const existingAreas = await tx
        .select()
        .from(areas)
        .where(inArray(areas.areaId, areaIds));
      const existingAreaIds = existingAreas.map((area) => area.areaId);
      const missingAreaIds = areaIds.filter(
        (areaId) => !existingAreaIds.includes(areaId),
      );
      if (missingAreaIds.length > 0) {
        throw new NotFoundException(
          `The following area IDs do not exist: ${missingAreaIds.join(', ')}`,
        );
      }
      // Insert truck
      const insertTruck = await tx
        .insert(trucks)
        .values({
          truckId: createTruckDto.truckId,
        })
        .returning();
      // Handle case where truck insertion fails
      if (insertTruck.length === 0) {
        throw new Error('Failed to insert truck');
      }
      const truckId = createTruckDto.truckId;

      // Insert resources
      const insertedResources = await tx
        .insert(truckResource)
        .values(
          createTruckDto.resources.map((resource) => ({
            truckId: truckId,
            resourceType: resource.resourceType,
            quantity: resource.quantity,
          })),
        )
        .returning();
      // Handle case where resources insertion fails
      if (insertedResources.length === 0) {
        throw new Error('Failed to insert resources');
      }
      // Insert travel time constraints
      const insertedTravelTime = await tx
        .insert(travelTimeToArea)
        .values(
          createTruckDto.travelTimeToAreaId.map((travelTime) => ({
            truckId: truckId,
            areaId: travelTime.areaId,
            time: travelTime.timeHour,
          })),
        )
        .returning();
      // Handle case where travel time constraints insertion fails
      if (insertedTravelTime.length === 0) {
        throw new Error('Failed to insert travel time constraints');
      }

      return {
        TruckID: insertTruck[0].truckId,
        AvailableResources: insertedResources,
        TravelTimeToArea: insertedTravelTime,
      };
    });
  }
}
