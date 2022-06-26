import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm'
import { Variant } from './Variant'
import { ProductToReview } from './ProductToReview'
import { Category } from './Category'

@Entity('product')
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
    
    @Column()
    title!: string

    @Column()
    description!: string

    @Column({
        nullable: true
    })
    imageURL!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @OneToMany(type => Variant, variant => variant.product, { cascade: true })
    variants!: Variant[]

    @OneToMany(type => ProductToReview, productToReview => productToReview.product)
    productToReview!: ProductToReview[]

    @ManyToOne(() => Category, category => category.products)
    category: Category;
}