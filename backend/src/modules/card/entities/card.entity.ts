import { MatchReport } from "src/modules/match-report/entities/match-report.entity";
import { Player } from "src/modules/player/entities/player.entity";
import { EnumCardType } from "src/types/card";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EnumCardType })
  type: EnumCardType;

  // Relacionamento com a Súmula
  @ManyToOne(() => MatchReport, (report) => report.cards, { onDelete: 'CASCADE' })
  matchReport: MatchReport;

  @Column()
  matchReportId: number;

  // Quem levou o cartão?
  @ManyToOne(() => Player, (player) => player.cards)
  player: Player;

  @Column()
  playerId: number;
}