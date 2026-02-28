import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { EnumReviewAction } from '../../../types/reviewMatchReport';

export class ReviewMatchReportDto {
  @IsEnum(EnumReviewAction, { message: 'A ação deve ser ACCEPT ou REJECT' })
  action: EnumReviewAction;

  @ValidateIf((o) => o.action === EnumReviewAction.REJECT)
  @IsString()
  reason?: string;
}
