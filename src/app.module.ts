import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { DisasterModule } from './disaster/disaster.module';
import { TrucksModule } from './trucks/trucks.module';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    DisasterModule,
    TrucksModule,
    AssignmentsModule,
  ],
  controllers: [],
})
export class AppModule {}
