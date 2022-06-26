import { NextFunction, Request, Response } from 'express'
import multer, { FileFilterCallback } from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const fileStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
        callback(null, `${__dirname}/../Images`)
    },

    filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
        callback(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

export const upload = multer({ storage: fileStorage, fileFilter: fileFilter })
   
