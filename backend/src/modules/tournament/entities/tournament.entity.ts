import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { TournamentKnockout } from '../../tournament-knockout/entities/tournament-knockout.entity';

@Entity({ name: 'tournament' })
export class Tournament {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;

	@OneToMany(() => TournamentKnockout, (knockout) => knockout.tournament)
	knockouts: TournamentKnockout[];

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;
}
