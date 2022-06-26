import { Request, Response } from 'express'
import { Profile } from '../models/entity/Profile'
import { UserService } from '../services/UserService'
import jwt from 'jsonwebtoken'

const register = async (req: Request, res: Response) => {
    const { mobileNumber } = req.body
    const userService = new UserService()

    try {
        const user = await userService.register(mobileNumber)
        res.status(201).send({
            message: 'Account created, Login code has been sent to mobile number.',
            user: user
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const verifyStoredUser = async (req: Request, res: Response) => {
    const { mobileNumber, mobileOTP } = req.body
    const userService = new UserService()

    try {
        const user = await userService.verifyStoredUser(mobileNumber, mobileOTP)

        // Create jwt for user
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).send({
            message: `User ${user.id} verified.`,
            user,
            token
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const login = async (req: Request, res: Response) => {
    const { mobileNumber } = req.body
    const userService = new UserService()

    try {
        const user = await userService.login(mobileNumber)
        res.status(200).send({
            message: `OTP sent.`,
            user
        })
    } catch (error) {
        res.status(401).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const verifyOTP = async (req: Request, res: Response) => {
    const { mobileNumber, mobileOTP } = req.body
    const userService = new UserService()
    try {
        const user = await userService.verifyOTP(mobileNumber, mobileOTP)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).send({
            message: `Login successful.`,
            user,
            token
        })
    } catch (error) {
        res.status(401).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const updateProfile = async (req: Request, res: Response) => {
    const userService = new UserService()
    const profileUpdates = req.body as Profile
    const userId = Number(req.userId)
    
    try {
        const user = await userService.updateProfile(profileUpdates, userId)
        res.status(200).send({
            message: 'User profile updated.',
            user: user
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const updateUserRole = async (req: Request, res: Response) => {
    const userService = new UserService()
    const userId = req.userId

    try {
        const user = await userService.updateUserRole(userId)
        res.status(200).send({
            message: 'User role updated.',
            user: user
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const addFavorite = async (req: Request, res: Response) => {
    const userService = new UserService()
    const userId =  req.userId
    const productId = req.params.id

    try {
        const user = await userService.addFavorite(userId, productId)
        res.status(200).send({
            message: `User favorite product with id ${productId}`,
            user: user
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const getFavorites = async (req: Request, res: Response) => {
    const userService = new UserService()
    const userId = req.userId

    try {
        const favorites = await userService.getFavorites(userId)
        res.status(200).send({
            message: `User ${userId} favorite products`,
            favorites: favorites
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const removeFavorite = async (req: Request, res: Response) => {
    const userService = new UserService()
    const userId = req.userId
    const productId = req.params.id
   
    try {
        const user = await userService.removeFavorite(userId, productId)
        res.status(200).send({
            message: `User removed product with id ${productId} from favorites.`,
            user: user
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const productReview = async (req: Request, res: Response) => {
    const userService = new UserService()
    const userId = req.userId
    const productId = req.params.id
    const productReviewBody = req.body

    try {
        const productReview = await userService.addProductReview(userId, productId, productReviewBody)
        res.status(200).send({
            message: `User ${userId} added review for product ${productId}.`,
            review: productReview
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}

const getUser = async (req: Request, res: Response) => {
    const userService = new UserService()
    const userId = req.userId
    // const orderService = new OrderService()
    try {
        const user = await userService.getUser(userId)
        // const order = orderService.addToCart('1','1')
        res.status(200).send({
            message: `User ${userId}.`,
            user
        })
    } catch (error) {
        res.status(400).send({
            message: 'An error occured!',
            error: error.message
        })
    }
}


export default { 
    register, 
    verifyStoredUser,
    login,
    verifyOTP, 
    updateProfile,
    updateUserRole,
    addFavorite,
    getFavorites,
    removeFavorite,
    productReview,
    getUser
}