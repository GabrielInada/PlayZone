import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MatchReport } from './match-report.entity';
import { Player } from '../../teams/entities/player.entity';

export enum CardType {
  YELLOW = 'YELLOW',
  RED = 'RED',
}

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CardType })
  type: CardType;

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