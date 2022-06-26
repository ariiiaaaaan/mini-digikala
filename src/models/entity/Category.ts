import { Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, TreeLevelColumn, OneToMany} from 'typeorm'
import { Product } from './Product';

@Entity('category')
@Tree("closure-table")
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @TreeChildren({
        cascade: true
    })
    children: Category[];

    @TreeParent({
        onDelete: 'CASCADE'
    })
    parent: Category;
    
    @OneToMany(type => Product, product => product.category)
    products: Product[]
}