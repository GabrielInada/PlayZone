import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('player')
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
