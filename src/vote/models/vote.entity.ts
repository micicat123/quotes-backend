import { Quote } from "../../quote/models/quote.entity"
import { User } from "../../user/models/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm"

@Entity('Votes')
export class Vote {

    @PrimaryGeneratedColumn()
    vote_id: number

    @Column({default: 1})
    decision: number

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User

    @ManyToOne(() => Quote)
    @JoinColumn({name: 'quote_id'})
    quote: Quote
}