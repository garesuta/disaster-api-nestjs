import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateDisasterDto } from './dto/create-disaster.dto';
import { DRIZZLE } from 'src/database/database.module';
import { DrizzleDB } from 'src/database/types/database';
import { areas, resources } from 'src/database/schema/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DisasterService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createDisasterDto: CreateDisasterDto) {
    // Validate the areaId
    return await this.db.transaction(async (tx) => {
      const existingArea = await tx
        .select()
        .from(areas)
        .where(eq(areas.areaId, createDisasterDto.areaId))
        .limit(1)
        .execute();
      if (existingArea.length > 0) {
        throw new BadRequestException(
          `Area with ID ${createDisasterDto.areaId} already exists.`,
        );
      }
      // Insert area
      const [area] = await tx
        .insert(areas)
        .values({
          areaId: createDisasterDto.areaId,
          urgencyLevel: createDisasterDto.urgencyLevel,
          timeConstraints: createDisasterDto.timeConstraints,
        })
        .returning();

      // Insert resources
      const insertedResources = await tx
        .insert(resources)
        .values(
          createDisasterDto.resources.map((resource) => ({
            areaId: area.areaId,
            resourceType: resource.resourceType,
            quantity: resource.quantity,
          })),
        )
        .returning();

      return {
        area,
        resources: insertedResources,
      };
    });
  }
}
