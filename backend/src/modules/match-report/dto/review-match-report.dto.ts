import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { EnumReviewAction } from '../../../types/reviewMatchReport';

export class ReviewMatchReportDto {
  @ApiProperty({
    enum: EnumReviewAction,
    example: EnumReviewAction.ACCEPT,
    description: 'Ação de revisão da súmula',
  })
  @IsEnum(EnumReviewAction, { message: 'A ação deve ser ACCEPT ou REJECT' })
  action: EnumReviewAction;

  @ApiPropertyOptional({
    example: 'Incorrect score informed in the report',
    description: 'Motivo é obrigatório quando action=REJECT',
  })
  @ValidateIf(
    (dto: ReviewMatchReportDto) => dto.action === EnumReviewAction.REJECT,
  )
  @IsString()
  @IsNotEmpty({ message: 'reason é obrigatório quando action=REJECT' })
  reason?: string;
}
