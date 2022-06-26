import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('profile')
export class Profile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({
        nullable: true
    })
    firstName: string

    @Column({
        nullable: true
    })
    lastName: string

    @Column({
        unique: true,
        nullable: true
    })
    email: string

    @Column({
        type: "text",
        nullable: true
    })
    address: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}