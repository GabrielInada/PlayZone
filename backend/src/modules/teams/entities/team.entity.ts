import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Player } from './player.entity';
import { Match } from '../../matches/entities/match.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  shieldUrl: string; // Escudo do time

  @Column({ nullable: true })
  city: string;

  // Um time tem vários jogadores
  @OneToMany(() => Player, (player) => player.team)
  players: Player[];

  // Relacionamento inverso para partidas onde é mandante
  @OneToMany(() => Match, (match) => match.homeTeam)
  homeMatches: Match[];

  // Relacionamento inverso para partidas onde é visitante
  @OneToMany(() => Match, (match) => match.awayTeam)
  awayMatches: Match[];
}