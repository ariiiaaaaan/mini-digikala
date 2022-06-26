import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm'
import { OrderItem } from './OrderItem'
import { Product } from './Product'

export type variantSize = 'S' | 'M' | 'L'
export type variantColor = 'Black' | 'Red' | 'White' 

@Entity('variant')
export class Variant extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({
        type: 'enum',
        enum: ['Black', 'Red', 'White'],
        default: 'Black'
    })
    color: variantColor

    @Column({
        type: 'enum',
        enum: ['S', 'M', 'L'],
        default: 'M'
    })
    size: variantSize
    
    @Column({
        nullable: true
    })
    price: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(type => Product, product => product.variants, { onDelete: 'CASCADE' })
    product: Product

    @OneToMany(type => OrderItem, orderItem => orderItem.variant)
    orderItem: OrderItem
}