import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Club {
    @PrimaryGeneratedColumn()
    id: number;

    name: string;

    
}
