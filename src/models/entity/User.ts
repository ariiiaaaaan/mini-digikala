import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm'
import { Profile } from './Profile'
import { Product } from './Product'
import { Matches } from 'class-validator'
import { ProductToReview } from './ProductToReview'

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
    
    @Column({
        unique: true
    })
    @Matches(/^[0-9]{11}$/gm)
    mobileNumber!: string

    @Column({
        nullable: true
    })
    OTPNumber!: string

    @Column({
        default: false
    })
    isAdmin!: boolean

    @Column({
        default: false
    })
    isVerified!: boolean

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @OneToOne(type => Profile, { onDelete: 'CASCADE' })
    @JoinColumn()
    profile!: Profile

    @OneToMany(type => ProductToReview, productToReview => productToReview.user)
    productToReview!: ProductToReview[]

    @ManyToMany(type => Product, { cascade: true })
    @JoinTable()
    favorites!: Product[];
}