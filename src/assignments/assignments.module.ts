import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  imports: [DatabaseModule],
})
export class AssignmentsModule { }
