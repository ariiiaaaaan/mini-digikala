import { IsInt, Min, Max } from 'class-validator'
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, OptimisticLockVersionMismatchError } from 'typeorm'
import { Product } from './Product'
import { User } from './User'

@Entity('productToReview')
export class ProductToReview extends BaseEntity {
    @PrimaryGeneratedColumn()
    productToReviewId!: number

    @Column()
    userId!: number

    @Column()
    productId!: number
    
    @Column()
    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number

    @Column()
    ratingDescription!: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(type => Product, product => product.productToReview, { cascade: true, onDelete: 'CASCADE' })
    product!: Product

    @ManyToOne(type => User, user => user.productToReview, { cascade: true })
    user!: User
}
