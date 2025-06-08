import { Controller, Post, Body } from '@nestjs/common';
import { DisasterService } from './disaster.service';
import { CreateDisasterDto } from './dto/create-disaster.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { UpdateDisasterDto } from './dto/update-disaster.dto';

@Controller('areas')
export class DisasterController {
  constructor(private readonly disasterService: DisasterService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new disaster area' })
  @ApiResponse({ status: 201, description: 'The created disaster area' })
  @ApiResponse({
    status: 400,
    description: 'Area with ID areaId already exists.',
  })
  create(@Body() createDisasterDto: CreateDisasterDto) {
    return this.disasterService.create(createDisasterDto);
  }
}
