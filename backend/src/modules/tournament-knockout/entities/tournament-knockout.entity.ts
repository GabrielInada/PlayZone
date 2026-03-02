import { Match } from '../../match/entities/match.entity';
import { Team } from '../../team/entities/team.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tournament_knockout' })
@Index(
  'IDX_tournament_knockout_stage_slot',
  ['tournamentName', 'stage', 'slot'],
  { unique: true },
)
export class TournamentKnockout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tournamentName: string;

  @Column()
  stage: string;

  @Column({ default: 1 })
  roundOrder: number;

  @Column()
  slot: number;

  @Column()
  @Index({ unique: true })
  matchId: number;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column({ nullable: true })
  winnerTeamId: number | null;

  @ManyToOne(() => Team, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'winnerTeamId' })
  winnerTeam?: Team | null;

  @Column({ type: 'boolean', default: false })
  isDecided: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
