import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const urgencyLevel = pgTable('urgencyLevel', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
});
