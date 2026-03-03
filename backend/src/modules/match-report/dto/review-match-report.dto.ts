import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { EnumReviewAction } from '../../../types/reviewMatchReport';

export class ReviewMatchReportDto {
  @ApiProperty({
    enum: EnumReviewAction,
    example: EnumReviewAction.ACCEPT,
    description: 'Ação da revisão da súmula',
  })
  @IsEnum(EnumReviewAction, { message: 'A ação deve ser ACCEPT ou REJECT' })
  action: EnumReviewAction;

  @ApiPropertyOptional({
    example: 'Erro no placar informado',
    description: 'Motivo obrigatório quando action=REJECT',
  })
  @ValidateIf(
    (dto: ReviewMatchReportDto) => dto.action === EnumReviewAction.REJECT,
  )
  @IsString()
  @IsNotEmpty({ message: 'reason é obrigatório quando action=REJECT' })
  reason?: string;
}
