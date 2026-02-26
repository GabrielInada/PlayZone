import { PartialType } from '@nestjs/mapped-types';
import { CreateStandingDto } from './create-standing.dto';

export class UpdateStandingDto extends PartialType(CreateStandingDto) {}
