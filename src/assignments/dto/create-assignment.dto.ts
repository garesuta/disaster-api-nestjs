import { Type } from 'class-transformer';
import { IsString, IsInt } from 'class-validator';

export class ResourceRequirementDto {
  @IsString()
  resourceType: string;

  @IsInt()
  quantity: number;
}

export class CreateAssignmentDto {
  @IsString()
  areaId: string;
  @IsString()
  truckId: string;
  @Type(() => ResourceRequirementDto)
  resourceRequirements: ResourceRequirementDto[];
}
