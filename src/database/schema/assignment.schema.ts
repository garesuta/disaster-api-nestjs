import { pgTable, serial, text, jsonb, time } from 'drizzle-orm/pg-core';
import { areas } from './areas.schema';
import { trucks } from './trucks.schema';

export const assignments = pgTable('assignments', {
  id: serial('id').primaryKey(),
  areaId: text('area_id')
    .notNull()
    .references(() => areas.areaId),
  truckId: text('truck_id').references(() => trucks.truckId),
  resourceDelivered: jsonb('resource_delivered'),
  createdAt: time('created_at').defaultNow(),
});
