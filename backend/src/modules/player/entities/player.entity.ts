import { Team } from 'src/modules/team/entities/team.entity';
import { EnumPlayerPosition } from 'src/types/player';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('player')
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    shirtNumber: number;

    @Column()
    position: EnumPlayerPosition;

    @ManyToOne(() => Team, (team) => team.players)
    team: Team;

    @Column()
    birthDate: Date;
    
    @Column()
    teamId: number;

    @Column()
    CreatedAt: Date;

    @Column()
    UpdatedAt: Date;
}
