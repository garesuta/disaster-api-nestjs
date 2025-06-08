import {
  IsString,
  IsInt,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResourceDto } from './create-resource.dto';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Create a new area for the disaster.',
})
export class CreateDisasterDto {
  @ApiProperty({
    description: 'The ID of the area.',
    example: 'A1',
    type: String,
  })
  @IsString()
  areaId: string;

  @ApiProperty({
    description: 'The urgency level of the area.',
    example: 3,
    type: Number,
  })
  @IsInt()
  @Min(1)
  urgencyLevel: number;

  @ApiProperty({
    description: 'The time constraints of the area.',
    example: 4,
    type: Number,
  })
  @IsInt()
  @Min(1)
  timeConstraints: number;

  @ApiProperty({
    description: 'The resources required by the area.',
    type: [CreateResourceDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateResourceDto)
  @ArrayMinSize(1)
  resources: CreateResourceDto[];
}
