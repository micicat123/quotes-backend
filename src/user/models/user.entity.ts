import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('Users')
export class User {

    @PrimaryGeneratedColumn()
    user_id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    karma: number

    @Column()
    picture: string
}