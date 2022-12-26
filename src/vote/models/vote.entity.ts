import { Quote } from "src/quote/models/quote.entity"
import { User } from "src/user/models/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm"

@Entity('Votes')
export class Vote {

    //upvotes, downvotes, score, decision
    //use .save to create new entry or update existing one 
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