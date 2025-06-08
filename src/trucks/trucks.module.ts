import { Module } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { TrucksController } from './trucks.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [TrucksController],
  providers: [TrucksService],
  imports: [DatabaseModule],
})
export class TrucksModule {}
