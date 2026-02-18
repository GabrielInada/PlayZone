import { EnumUserRole, EnumUserType } from "src/types/user";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}
