import { User } from '../models/entity/User'
import { Profile } from '../models/entity/Profile'
import { validate } from 'class-validator'
import utility from '../utils/SmsApi'
import { getRepository, Repository } from 'typeorm'
import { Product } from '../models/entity/Product'
import { ProductToReview } from '../models/entity/ProductToReview'


export class UserService {
    private userRepository: Repository<User>
    private productRepository: Repository<Product>
    private productToReviewRepository: Repository<ProductToReview>
    
    constructor(
        userRepository: Repository<User> = getRepository(User),
        productRepository: Repository<Product> = getRepository(Product),
        productToReviewRepository: Repository<ProductToReview> = getRepository(ProductToReview)
    ) {
        this.userRepository = userRepository
        this.productRepository = productRepository
        this.productToReviewRepository = productToReviewRepository
    }

    public async register(mobileNumber: string): Promise<User> {
        // Check if number exists
        if(await this.isDuplicateMobileNumber(mobileNumber)) {
            throw new Error('Phone already exists.')
        } 

        // Create new user
        const user = new User()
        
        user.mobileNumber = mobileNumber
        
        // Generate OTP and send it to created user
        const mobileOTP = await utility.sendVerificatonCode(mobileNumber)
        user.OTPNumber = mobileOTP
        
        // Store partial User
        await this.userRepository.save(user)
        // Validate User entity inputs
        const validationErrors = await validate(user);
    
        if (validationErrors.length > 0) {
            throw new Error('Validation failed: ' + validationErrors)
        }

        // Store complete User
        await this.userRepository.save(user)

        return user
    }

    public async verifyStoredUser(mobileNumber: string, mobileOTP: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { mobileNumber }
        })

        if(!user) {
            throw new Error('User does not exist')
        }

        if(user.OTPNumber !== mobileOTP) {
            throw new Error('Verifying failed, Please enter otp correctly.')
        }

        if(user.profile !== null) {
            user.OTPNumber = ''
            return await this.userRepository.save(user)
        }

        user.OTPNumber = ''
        // Creating user and profile relation
        const profile = new Profile()
        user.profile = profile
        user.isVerified = true
            
        return await this.userRepository.save(user)
    }

    public async login(mobileNumber: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { mobileNumber } })
        
        if(!user) {
            throw new Error('User does not exist')
        }
        
        if(!user.isVerified) {
            throw new Error('Login failed, Please verify your account')
        }
        
        const mobileOTP = await utility.sendVerificatonCode(mobileNumber)
        user.OTPNumber = mobileOTP

        return await this.userRepository.save(user)
    }

    public async verifyOTP(mobileNumber: string, mobileOTP: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { mobileNumber } })
        
        if(!user) {
            throw new Error('User does not exist')
        }
        
        if(user.OTPNumber !== mobileOTP) {
            throw new Error('Login failed, Please try again.')
        }
        user.OTPNumber = ''

        return await this.userRepository.save(user)
    }

    public async updateProfile(profileUpdates: Profile, userId: number): Promise<User> {
        const updates = Object.keys(profileUpdates)
        const allowedUpdates = ['firstName', 'lastName', 'email', 'address']
        const isValidOperation = updates.every(update => allowedUpdates.includes(update))
        
        if(!isValidOperation) {
            throw new Error('Invalid updates.')
        }
        
        const userProfile = await this.userRepository.findOne(userId, { relations: ['profile'] })
        
        // Update allowed fields of user profile
        updates.forEach(update => userProfile.profile[update] = profileUpdates[update])
        await userProfile.save()

        return userProfile  
    }

    public async updateUserRole(userId: string): Promise<User> {
        const user = await this.getUser(userId)
        user.isAdmin = !user.isAdmin
        return await this.userRepository.save(user)
    }

    public async getUser(userId: string): Promise<User> {
        return await this.userRepository.findOneOrFail(userId, { relations: ['profile'] })
    }

    public async addFavorite(userId: any, productId: any): Promise<User> {
        const product = await this.productRepository.findOne(productId)
        if(!product) {
            throw new Error(`Can not find product with id ${productId}`)
        }
        const user = await this.userRepository.findOne(userId, { relations: ['favorites'] })
        user.favorites.push(product)
        return await user.save()
    }

    public async getFavorites(userId: any): Promise<Product[]> {
        const user = await this.userRepository.findOne(userId, { relations: ['favorites'] })
        return user.favorites
    }

    public async removeFavorite(userId: any, productId: any): Promise<User> {
        const user = await this.userRepository.findOne(userId, { relations: ['favorites'] })
        const productToRemove = await this.productRepository.findOne(productId)
        user.favorites = user.favorites.filter(product => product.id !== productToRemove.id)
        return await user.save()
    }

    public async addProductReview(userId: any, productId: any, productReview: any): Promise<ProductToReview> {
        // Prevent adding duplicate review for same product
        if(await this.isDuplicateReview(userId, productId)) {
            throw new Error('Review already exists.')
        }

        const user = await this.userRepository.findOne(userId, { relations: ['productToReview'] })
        const product = await this.productRepository.findOne(productId, { relations: ['productToReview'] })
        
        if(!product) {
            throw new Error(`Can not find product with id ${productId}`);
        }
        
        if(!productReview) {
            throw new Error('Invalid updates.')
        }

        const productToReview = new ProductToReview()
        productToReview.rating = productReview.rating
        productToReview.ratingDescription = productReview.description
        productToReview.user = user
        productToReview.product = product

        const validationErrors = await validate(productToReview);
        if (validationErrors.length > 0) {
            throw new Error('Validation failed: ' + validationErrors)
        }
        
        return await this.productToReviewRepository.save(productToReview)
    }

    private async isDuplicateMobileNumber(mobileNumber: string): Promise<Boolean> {
        const user = await this.userRepository.findOne({
            select: [ 'mobileNumber' ],
            where: { mobileNumber }
        })
        return user !== undefined
    }

    private async isDuplicateReview(userId: any, productId: any): Promise<Boolean> {
        const review = await this.productToReviewRepository.findOne({
            select: ['userId', 'productId'],
            where: { userId, productId }
        })
        return review !== undefined
    }
}