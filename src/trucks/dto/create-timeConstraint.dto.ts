import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

@ApiSchema({
  description: 'Create a new truck time constraint to area.',
})
export class CreateTruckTimeConstraintDto {
  @ApiProperty({
    description: 'The ID of the area.',
    example: 'A1',
    type: String,
  })
  @IsString()
  areaId: string;

  @ApiProperty({
    description: 'The time constraint in hours.',
    example: 4,
    type: Number,
  })
  @IsInt()
  @Min(1)
  timeHour: number;
}
