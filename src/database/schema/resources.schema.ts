import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { areas } from './areas.schema';

export const resources = pgTable('area_resources', {
  id: serial('id').primaryKey(),
  areaId: text('area_id')
    .notNull()
    .references(() => areas.areaId),
  resourceType: text('resourceType').notNull(),
  quantity: integer('quantity').notNull(),
});
