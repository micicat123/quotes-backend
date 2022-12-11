import { User } from "src/user/models/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"

@Entity('Quotes')
export class Quote {

    @PrimaryGeneratedColumn()
    quote_id: number

    @Column()
    quote: string

    @Column()
    upvotes: number

    @Column()
    downvotes: number

    @Column()
    score: number

    @Column({ type: 'timestamptz' })
    created_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User
}