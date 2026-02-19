import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchReportDto } from './create-match-report.dto';

export class UpdateMatchReportDto extends PartialType(CreateMatchReportDto) {}
