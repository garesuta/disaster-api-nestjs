import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as schema from './schema/schema';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

export const DRIZZLE = Symbol('drizzle-connetion');

@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          throw new Error(
            'DATABASE_URL is not defined in the environment variables',
          );
        }
        const pool = new Pool({
          connectionString: databaseUrl,
          ssl: true,
        });
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
