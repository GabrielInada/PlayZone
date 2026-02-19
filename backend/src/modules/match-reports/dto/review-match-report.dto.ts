import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { EnumReviewAction } from 'src/types/reviewMatchReport';

export class ReviewMatchReportDto {
  @IsEnum(EnumReviewAction, { message: 'A ação deve ser ACCEPT ou REJECT' })
  action: EnumReviewAction;

  // O motivo é obrigatório APENAS se a ação for REJECT
  @ValidateIf(o => o.action === EnumReviewAction.REJECT)
  @IsString()
  reason?: string;
}