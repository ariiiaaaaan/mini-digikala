import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import { Order } from './Order'
import { Variant } from './Variant'

@Entity('order-item')
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    quantity!: number
    
    @Column({
        nullable: true
    })
    price!: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(type => Order, order => order.orderItem, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
    order!: Order

    @ManyToOne(type => Variant, variant => variant.orderItem)
    variant!: Variant
}