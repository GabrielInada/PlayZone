import { Card } from "src/modules/card/entities/card.entity";
import { Goal } from "src/modules/goal/entities/goal.entity";
import { Match } from "src/modules/match/entities/match.entity";
import { EnumReportStatus } from "src/types/report";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";


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

  @Column({ type: 'enum', enum: EnumReportStatus, default: EnumReportStatus.PENDING })
  status: EnumReportStatus;

  @Column({ type: 'text', nullable: true })
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