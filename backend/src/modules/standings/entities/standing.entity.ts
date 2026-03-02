import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'standing' })
export class Standing {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  teamId: number;

  @Column()
  teamName: string;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  games: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  draws: number;

  @Column({ default: 0 })
  losses: number;

  @Column({ default: 0 })
  gf: number;

  @Column({ default: 0 })
  ga: number;

  @Column({ default: 0 })
  gd: number;

  @Column({ default: 0 })
  position: number;

  @Column({ type: 'timestamp', nullable: true })
  lastUpdatedAt: Date | null;
}
