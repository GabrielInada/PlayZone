import { Match } from '../../match/entities/match.entity';
import { Team } from '../../team/entities/team.entity';
import { Tournament } from '../../tournament/entities/tournament.entity';
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
  'IDX_tournament_knockout_tournament_stage_slot',
  ['tournamentId', 'stage', 'slot'],
  { unique: true },
)
export class TournamentKnockout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tournamentId: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.knockouts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column()
  stage: string;

  @Column({ default: 1 })
  roundOrder: number;

  @Column({ type: 'integer', nullable: true })
  slot: number | null;

  @Column()
  @Index({ unique: true })
  matchId: number;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column({ type: 'integer', nullable: true })
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
