import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Match } from '../../matches/entities/match.entity';
import { Goal } from './goal.entity';
import { Card } from './card.entity';
import { ReportStatus } from '../../../common/enums/status.enum';

@Entity()
export class MatchReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  homeScore: number;

  @Column()
  awayScore: number;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column({ nullable: true })
  adminNote: string | null;
  

  @CreateDateColumn()
  createdAt: Date;

  // Relacionamento 1:1 com Partida
  @OneToOne(() => Match, (match) => match.report)
  @JoinColumn() // O lado que possui a Foreign Key deve ter o JoinColumn
  match: Match;

  @Column()
  matchId: number;

  // Cascade true permite salvar gols/cartões ao salvar a súmula
  @OneToMany(() => Goal, (goal) => goal.matchReport, { cascade: true })
  goals: Goal[];

  @OneToMany(() => Card, (card) => card.matchReport, { cascade: true })
  cards: Card[];
}