import { Card } from 'src/modules/card/entities/card.entity';
import { Goal } from 'src/modules/goal/entities/goal.entity';
import { Team } from 'src/modules/team/entities/team.entity';
import { EnumPlayerPosition } from 'src/types/player';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
    teamId: number;

    // Relacionamentos inversos (opcional, útil para estatísticas do jogador)
    @OneToMany(() => Goal, (goal) => goal.player)
    goals: Goal[];

    @OneToMany(() => Card, (card) => card.player)
    cards: Card[];

    @Column({ type: 'timestamp' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date | null;
}
