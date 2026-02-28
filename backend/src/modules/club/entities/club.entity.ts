import { Team } from '../../team/entities/team.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Club {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    badgeImage?: string | null;

    @OneToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'ownerUserId' })
    owner: User;

    @Column({ unique: true })
    ownerUserId: number;

    @OneToMany(() => Team, (team) => team.club)
    teams: Team[];

    @Column({ type: 'timestamp' })
    createdAt: Date;

    @Column({ type: 'timestamp' })
    updatedAt: Date;
}
