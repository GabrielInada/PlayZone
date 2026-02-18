import { Player } from 'src/modules/player/entities/player.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Team {
    @Column()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Player, (player) => player.team)
    players: Player[];
}
