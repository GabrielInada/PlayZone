import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('player')
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    shirtNumber: number;

    @Column()
    position: string;

    @Column()
    birthDate: Date;
    
    @Column()
    teamId: number;

    @Column()
    CreatedAt: Date;

    @Column()
    UpdatedAt: Date;
}
