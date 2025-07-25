import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

@ApiSchema({
  description: 'Create a new truck resource.',
})
export class CreateTruckResourceDto {
  @ApiProperty({
    description: 'The type of the resource.',
    example: 'food',
    type: String,
  })
  @IsString()
  resourceType: string;

  @ApiProperty({
    description: 'The quantity of the resource.',
    example: 10,
    type: Number,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
