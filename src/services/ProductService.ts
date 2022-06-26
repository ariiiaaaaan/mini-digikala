import { Product } from '../models/entity/Product'
import { Variant } from '../models/entity/Variant'
import { getRepository, Repository } from 'typeorm'
import fsPromises from 'fs'
import { ProductToReview } from '../models/entity/ProductToReview'
import { Category } from '../models/entity/Category'


export class ProductService {
    private productRepository: Repository<Product>
    private variantRepository: Repository<Variant>
    private productToReviewRepository: Repository<ProductToReview>
    private categoryRepository: Repository<Category>

    
    constructor(
        productRepository: Repository<Product> = getRepository(Product), 
        variantRepository: Repository<Variant> = getRepository(Variant),
        productToReviewRepository: Repository<ProductToReview> = getRepository(ProductToReview),
        categoryRepository: Repository<Category> = getRepository(Category)
    ) {
        this.productRepository = productRepository
        this.variantRepository = variantRepository
        this.productToReviewRepository = productToReviewRepository
        this.categoryRepository = categoryRepository
    }

    public async addProduct(productData: any, categoryId?: string): Promise<Product> {
        const product = new Product()
        if(categoryId !== undefined) {
            const category = await this.categoryRepository.findOneOrFail(categoryId)
            product.category = category
        }
        product.title = productData.title
        product.description = productData.description
        product.variants = productData.variants
        
        return await this.productRepository.save(product)
    }

    public async addProductCategory(productId: string, categoryId: string): Promise<Product> {
        const product = await this.productRepository.findOneOrFail(productId)
        const category = await this.categoryRepository.findOneOrFail(categoryId)
        product.category = category
        return await this.productRepository.save(product)
    }

    public async getProducts(): Promise<Product[]> {
        return await this.productRepository.find({ relations: ['variants']})
    }

    public async getProduct(productId: string): Promise<Product> {
        return await this.productRepository.findOneOrFail(productId,{ relations: ['variants']})
    }

    public async getProductVariants(productId: string): Promise<Variant[]> {
        return await this.variantRepository.find({ where: { product: productId }})
    }

    public async updateVariant(variantBody: any, variantId: string): Promise<Variant> {
        const updates = Object.keys(variantBody).filter(update => update !== 'id')
        const allowedUpdates = ['color', 'size', 'price']
        const isValidOperation = updates.every(update => allowedUpdates.includes(update))

        if(!isValidOperation) {
            throw new Error('Invalid updates.')
        }

        const variant = await this.variantRepository.findOne(variantId)
        updates.forEach(update => variant[update] = variantBody[update])
        
        return await this.variantRepository.save(variant)
    }

    public async updateProductImage(id: string, image: Express.Multer.File): Promise<Product> {
        try {
            const product = await this.productRepository.findOneOrFail(id)
            const oldState = { ...product } // For saving previous state of product
            product.imageURL = image.destination + '/' + image.filename
            const saved = await this.productRepository.save(product)
            if(oldState.imageURL !== null) await this.deleteImage(oldState.imageURL)
            return saved
        } catch (error) {
            await this.deleteImage(image.destination + '/' + image.filename)
            throw new Error(error)
        }
    }

    public async removeProduct(productId: string) : Promise<Product> {
        const productToRemove = await this.productRepository.findOneOrFail(productId)
        // Delete product image from storage if exists
        await this.deleteImage(productToRemove.imageURL)
        // Remove product
        return await productToRemove.remove()
    }

    public async updateProduct(productBody: any, productId: string): Promise<Product> {
        const updates = Object.keys(productBody)
        const allowedUpdates = ['title', 'description']
        const isValidOperation = updates.every(update => allowedUpdates.includes(update))
        
        if(!isValidOperation) {
            throw new Error('Invalid updates.')
        }

        const product = await this.productRepository.findOne(productId, { relations: ['variants']})
        updates.forEach(update => product[update] = productBody[update])
        return await this.productRepository.save(product)
    }

    public async getProductReviews(productId: string): Promise<ProductToReview[]> {
        return await this.productToReviewRepository.find({ where: { productId } })
    }

    private async deleteImage(path: string): Promise<void> {
        if(fsPromises.existsSync(path)) {
            fsPromises.unlink(path, (error) => {
                if(error) {
                    throw new Error('Can not delete image url from storage, ' + error.message)
                }
            })
        }
    }
}   