import { Controller, Post, Get, Delete } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { CreateAssignmentDto } from './dto/create-assignment.dto';
// import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  @ApiResponse({
    status: 400,
    description: 'No pending area to assign, No available trucks, or No suitable trucks',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createdAssignment() {
    return await this.assignmentsService.createAssignment();
  }
  @Get()
  @ApiOperation({ summary: 'Get the latest assignment' })
  @ApiResponse({
    status: 200,
    description: 'Latest assignment retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'No latest assignment found' })
  async getLatestAssignment() {
    return this.assignmentsService.getLatestAssignment();
  }
  @Delete()
  @ApiOperation({ summary: 'Clear the latest assignment' })
  @ApiResponse({
    status: 200,
    description: 'Latest assignment cleared successfully',
  })
  async clearAssignment() {
    return this.assignmentsService.clearAssignment();
  }
}
