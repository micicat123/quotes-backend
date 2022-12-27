import { User } from "src/user/models/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"

@Entity('Quotes')
export class Quote {

    @PrimaryGeneratedColumn()
    quote_id: number;

    @Column()
    quote: string;

    @Column({default:0})
    upvotes: number;

    @Column({default:0})
    downvotes: number;

    @Column({default:0})
    score: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User
}