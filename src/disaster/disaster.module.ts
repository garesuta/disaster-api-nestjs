import { Module } from '@nestjs/common';
import { DisasterService } from './disaster.service';
import { DisasterController } from './disaster.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [DisasterController],
  providers: [DisasterService],
  imports: [DatabaseModule],
})
export class DisasterModule {}
