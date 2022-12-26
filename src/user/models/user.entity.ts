import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('Users')
export class User {

    @PrimaryGeneratedColumn()
    user_id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @Column()
    picture: string
}