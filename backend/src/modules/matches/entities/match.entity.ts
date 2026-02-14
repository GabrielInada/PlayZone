import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { User } from '../../users/entities/user.entity';
import { MatchReport } from '../../match-reports/entities/match-report.entity';
import { MatchStatus } from '../../../common/enums/status.enum';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: MatchStatus, default: MatchStatus.SCHEDULED })
  status: MatchStatus;

  // Relacionamentos
  @ManyToOne(() => Team, (team) => team.homeMatches)
  homeTeam: Team;

  @ManyToOne(() => Team, (team) => team.awayMatches)
  awayTeam: Team;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'delegateId' })
  delegate: User;

  @Column({ nullable: true })
  delegateId: number;

  @OneToOne(() => MatchReport, (report) => report.match)
  report: MatchReport;
}