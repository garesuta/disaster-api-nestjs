import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { areas } from './areas.schema';

export const trucks = pgTable('trucks', {
  truckId: text('truck_id').notNull().primaryKey(),
  isAssigned: boolean('is_assigned').notNull().default(false),
});

export const truckResource = pgTable('trucks_resource', {
  id: serial('id').notNull().primaryKey(),
  truckId: text('truck_id')
    .notNull()
    .references(() => trucks.truckId, { onDelete: 'cascade' }),
  resourceType: text('resource_type').notNull(),
  quantity: integer('quantity').notNull(),
});

export const travelTimeToArea = pgTable('travel_time_to_area', {
  id: serial('id').notNull().primaryKey(),
  truckId: text('truck_id')
    .notNull()
    .references(() => trucks.truckId, { onDelete: 'cascade' }),
  areaId: text('area_id')
    .notNull()
    .references(() => areas.areaId, { onDelete: 'cascade' }),
  time: integer('hours').notNull(),
});
