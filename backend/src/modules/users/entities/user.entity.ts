import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Match } from '../../matches/entities/match.entity';
import { Role } from '../../../common/enums/status.enum'; // Importando do Enum criado anteriormente

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Lembre-se de hashear a senha antes de salvar

  @Column({ type: 'enum', enum: Role, default: Role.CLUBE })
  role: Role;

  // Relacionamento inverso: Um delegado pode ter várias partidas atribuídas
  @OneToMany(() => Match, (match) => match.delegate)
  assignedMatches: Match[];
}