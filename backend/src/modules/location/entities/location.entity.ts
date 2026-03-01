import { Match } from '../../match/entities/match.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ type: 'text', nullable: true })
	address?: string | null;

	@Column({ type: 'varchar', nullable: true })
	city?: string | null;

	@Column({ type: 'varchar', nullable: true })
	state?: string | null;

	@OneToMany(() => Match, (match) => match.location)
	matches: Match[];

	@Column({ type: 'timestamp' })
	createdAt: Date;

	@Column({ type: 'timestamp' })
	updatedAt: Date;
}
