import { getRepository, Repository } from 'typeorm'
import { Order } from '../models/entity/Order'
import { OrderItem } from '../models/entity/OrderItem'
import { Variant } from '../models/entity/Variant'
import { UserService } from './UserService'
import { User } from '../models/entity/User'

export class OrderService {
    private orderItemRepository: Repository<OrderItem>
    private variantRepository: Repository<Variant>
    private orderRepository: Repository<Order>
    
    constructor(
        orderItemRepository: Repository<OrderItem> = getRepository(OrderItem),
        variantRepository: Repository<Variant> = getRepository(Variant),
        orderRepository: Repository<Order> = getRepository(Order)
    ) {
        this.orderItemRepository = orderItemRepository
        this.variantRepository = variantRepository
        this.orderRepository = orderRepository
    }

    public async addToCart(variantId: string, userId: string): Promise<Order> {
        const userService = new UserService()
        const user = await userService.getUser(userId)
        const variant = await this.variantRepository.findOneOrFail(variantId, { relations: ['product'] })
        const order = await this.getOrCreateCart(user)
        const orderItem = await this.orderItemRepository.find({ relations: ['variant'], where: { order } })
        const existingProductIndex = orderItem.findIndex(item => item.variant.id == variant.id)
        
        if (existingProductIndex >= 0)  { // If product already exist in cart
            order.orderItem[existingProductIndex].quantity++
            order.totalPrice += orderItem[existingProductIndex].price
        } else { // Not exist
            const newItem = new OrderItem()
            newItem.variant = variant
            newItem.price = variant.price
            newItem.quantity = 1
            order.totalPrice += newItem.price
            order.orderItem.push(newItem)
        }
        return await this.orderRepository.save(order)
    }

    
    public async getCart(userId: string): Promise<Order> | undefined {
        return await this.orderRepository.findOne({ relations: ['user', 'orderItem'], where: { user: userId, status: 'shopping-cart' } })
    }
    
    public async removeFromCart(variantId: string, userId: string): Promise<Order> {
        const order = await this.getCart(userId)
        if(order === undefined || order.status !== 'shopping-cart') { throw new Error('Cart does not exist.') }
        const orderItems = await this.orderItemRepository.find({ relations: ['variant'], where: { order } })
        if(orderItems.length === 0) { 
            await this.orderRepository.delete(order.id)
            throw new Error('Cart is empty.')
        }
        const variatToRemoveIndex = orderItems.findIndex(item => item.variant.id == Number(variantId))
        if(variatToRemoveIndex < 0) { throw new Error('Item not found.') }
        order.orderItem[variatToRemoveIndex].quantity--
        order.totalPrice -= orderItems[variatToRemoveIndex].price
        if(order.orderItem[variatToRemoveIndex].quantity === 0) {
            order.orderItem.splice(variatToRemoveIndex,1)
        }
        
        return await this.orderRepository.save(order)
    }

    public async removeCart(userId: string): Promise<void> {
        const order = await this.getCart(userId)
        await this.orderItemRepository.delete(order.id)
    }

    public async checkout(userId: string): Promise<Order> {
        const BankResult = true // Should replace with bank function
        const order = await this.getCart(userId)
        if(order === undefined) {
            throw new Error('Cart is empty.')
        }
        if(BankResult) {
            order.status = 'complete'
            return this.orderRepository.save(order)
        } else {
            order.status = 'payment'
            this.orderRepository.save(order)
            throw new Error('Payment failed, Please try again.')
        }
    }

    private async getOrCreateCart(user: User): Promise<Order> {
        const orderPromise = await this.getCart((user.id).toString())
        if(orderPromise) return orderPromise
        const order = new Order()
        order.totalPrice = 0
        order.status = 'shopping-cart'
        order.user = user
        order.orderItem = []
        return await this.orderRepository.save(order)
    }
}