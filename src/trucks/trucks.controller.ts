import { Controller, Post, Body } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { UpdateTruckDto } from './dto/update-truck.dto';

@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new resource truck' })
  @ApiResponse({
    status: 201,
    description: 'The resource truck has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Truck with ID truckId already exists.',
  })
  create(@Body() createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }
}
