import { Request, Response } from 'express'
import { OrderService } from '../services/OrderService'


const addToCart = async (req: Request, res: Response) => {
    const orderService = new OrderService()
    const userId = req.userId
    try {
        const order = await orderService.addToCart(req.params.variantId, userId)
        res.status(200).send({
            message: 'Added to cart',
            order
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const getCart = async (req: Request, res: Response) => {
    const orderService = new OrderService()
    const userId = req.userId
    try {
        const order = await orderService.getCart(userId)
        res.status(200).send({
            message: `User ${userId} shopping cart.`,
            order
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }

}

const removeFromCart = async (req: Request, res: Response) => {
    const orderService = new OrderService()
    const userId = req.userId
    try {
        const order = await orderService.removeFromCart(req.params.variantId, userId)
        res.status(200).send({
            message: 'Removed from cart',
            order
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const checkout = async (req: Request, res: Response) => {
    const orderService = new OrderService()
    const userId = req.userId
    try {
        const order = await orderService.checkout(userId)
        res.status(200).send({
            message: 'Payment complete.',
            order
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

export default {
    addToCart,
    getCart,
    removeFromCart,
    checkout
}