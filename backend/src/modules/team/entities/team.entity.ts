import { Match } from '../../match/entities/match.entity';
import { Player } from '../../player/entities/player.entity';
import { Club } from '../../club/entities/club.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    clubId: number;

    @ManyToOne(() => Club, (club) => club.teams)
    @JoinColumn({ name: 'clubId' })
    club: Club;

    @Column()
    coachName: string;
    
    @OneToMany(() => Player, (player) => player.team)
    players: Player[];

    @OneToMany(() => Match, (match) => match.homeTeam)
    homeMatches: Match[];

    @OneToMany(() => Match, (match) => match.awayTeam)
    awayMatches: Match[];

    @Column()
    createdAt: Date;
    
    @Column()
    updatedAt: Date;
}
