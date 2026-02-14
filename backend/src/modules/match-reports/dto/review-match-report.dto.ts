import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';

export enum ReviewAction {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
}

export class ReviewMatchReportDto {
  @IsEnum(ReviewAction, { message: 'A ação deve ser ACCEPT ou REJECT' })
  action: ReviewAction;

  // O motivo é obrigatório APENAS se a ação for REJECT
  @ValidateIf(o => o.action === ReviewAction.REJECT)
  @IsString()
  reason?: string;
}