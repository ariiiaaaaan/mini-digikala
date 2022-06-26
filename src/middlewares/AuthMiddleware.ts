import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
    id: string,
    iat: number,
    exp: number
}

export default function authMiddleware (req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    
    if(!authorization) {
        return res.sendStatus(401)
    }

    const token = authorization.replace('Bearer ', '')
   
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id } = decoded as TokenPayload
        req.userId  = id
        return next()
    } catch (error) {
        return res.sendStatus(401)  
    } 
}