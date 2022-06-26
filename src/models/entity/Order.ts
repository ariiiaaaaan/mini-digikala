import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany, ManyToOne } from 'typeorm'
import { OrderItem } from './OrderItem'
import { User } from './User'

export type Status = 'complete' | 'shopping-cart' | 'payment'

@Entity('order')
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: 'shopping-cart'
    })
    status: Status

    @Column({
        nullable: true
    })
    totalPrice!: number
 
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(type => User)
    @JoinColumn()
    user!: User

    @OneToMany(type => OrderItem, orderItem => orderItem.order, { cascade: true })
    orderItem!: OrderItem[]
}