import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MatchReport } from './match-report.entity';
import { Player } from '../../teams/entities/player.entity';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  minute: number; // Minuto do gol

  // Relacionamento com a Súmula
  @ManyToOne(() => MatchReport, (report) => report.goals, { onDelete: 'CASCADE' })
  matchReport: MatchReport;

  @Column()
  matchReportId: number;

  // Quem fez o gol?
  @ManyToOne(() => Player, (player) => player.goals)
  player: Player;

  @Column()
  playerId: number;
}