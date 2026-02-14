import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Team } from './team.entity';
import { Goal } from '../../match-reports/entities/goal.entity';
import { Card } from '../../match-reports/entities/card.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  number: number;

  @Column({ nullable: true })
  position: string; // Goleiro, Fixo, Ala, Pivô

  @ManyToOne(() => Team, (team) => team.players)
  team: Team;

  @Column()
  teamId: number;

  // Relacionamentos inversos (opcional, útil para estatísticas do jogador)
  @OneToMany(() => Goal, (goal) => goal.player)
  goals: Goal[];

  @OneToMany(() => Card, (card) => card.player)
  cards: Card[];
}