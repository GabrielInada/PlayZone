import { MatchReport } from "../../match-report/entities/match-report.entity";
import { Team } from "../../team/entities/team.entity";
import { User } from "../../user/entities/user.entity";
import { EnumMatchStatus } from "../../../types/match";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: EnumMatchStatus, default: EnumMatchStatus.SCHEDULED })
  status: EnumMatchStatus;

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
