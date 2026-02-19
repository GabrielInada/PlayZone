import { Match } from "src/modules/match/entities/match.entity";
import { EnumUserRole, EnumUserType } from "src/types/user";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    
    @Column()
    role: EnumUserRole;

    @Column()
    type: EnumUserType;

    // Relacionamento inverso: Um delegado pode ter várias partidas atribuídas
    @OneToMany(() => Match, (match) => match.delegate)
    assignedMatches: Match[];

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}
