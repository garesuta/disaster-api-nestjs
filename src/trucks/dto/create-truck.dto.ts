import { IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTruckResourceDto } from './create-resource.dto';
import { CreateTruckTimeConstraintDto } from './create-timeConstraint.dto';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Create a new truck.',
})
export class CreateTruckDto {
  @ApiProperty({
    description: 'The ID of the truck.',
    example: 'T1',
    type: String,
  })
  @IsString()
  truckId: string;

  @ApiProperty({
    description: 'The resources required by the truck.',
    type: [CreateTruckResourceDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTruckResourceDto)
  @ArrayMinSize(1)
  resources: CreateTruckResourceDto[];

  @ApiProperty({
    description: 'The time constraints of the truck.',
    type: [CreateTruckTimeConstraintDto],
  })
  @ArrayMinSize(1)
  travelTimeToAreaId: CreateTruckTimeConstraintDto[];
}
