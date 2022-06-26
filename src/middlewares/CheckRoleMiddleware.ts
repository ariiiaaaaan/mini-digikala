import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/UserService'

export default async function checkUserRole(req: Request, res: Response, next: NextFunction) {
    const userService = new UserService()
    const userId = req.userId
    
    try {
        const user = await userService.getUser(userId)
        if(user.isAdmin) return next()
        throw new Error('Unathorized role.')
    } catch (error) {
        res.status(403).send({ error: error.message })
    } 
}

