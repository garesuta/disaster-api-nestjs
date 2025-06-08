import { boolean, integer, pgTable, text, time } from 'drizzle-orm/pg-core';
import { urgencyLevel } from './urgency.schema';

export const areas = pgTable('areas', {
  areaId: text('area_id').notNull().primaryKey(),
  urgencyLevel: integer('urgency_level')
    .notNull()
    .references(() => urgencyLevel.id),
  timeConstraints: integer('time_constraints').notNull(),
  isAssigned: boolean('is_assigned').notNull().default(false),
  createdAt: time('created_at').notNull().defaultNow(),
});
