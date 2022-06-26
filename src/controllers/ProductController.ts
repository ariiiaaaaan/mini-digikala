import { Request, Response } from 'express'
import { ProductService } from '../services/ProductService'

const addProduct = async (req: Request, res: Response) => {
    const productData = req.body
    const categoryId = req.params.categoryId
    const productService = new ProductService()

    try {
        const product = await productService.addProduct(productData, categoryId)
        res.status(200).send({
            message: 'Product added.',
            product: product
        })
    } catch (error) {
        res.status(400).send({
            message: 'Something went wrong',
            error: error.message
        })
    }
}

const addProductCategory = async (req: Request, res: Response) => {
    const productId = req.params.productId
    const categoryId = req.params.categoryId
    const productService = new ProductService()

    try {
        const product = await productService.addProductCategory(productId, categoryId)
        res.status(200).send({
            message: `Product ${productId} now have category ${categoryId}`,
            product: product
        })
    } catch (error) {
        res.status(400).send({
            message: 'Something went wrong',
            error: error.message
        })
    }
}

const getProducts = async (req: Request, res: Response) => {
    const productService = new ProductService()
    try {
        const products = await productService.getProducts()
        res.status(200).send({
            message: 'Products list.',
            product: products
        })
    } catch (error) {
        res.status(400).send({
            message: 'Can not fetch products list from database.',
            error: error.message
        })
    }
}


const getProduct = async (req: Request, res: Response) => {
    const productService = new ProductService()
    try {
        const product = await productService.getProduct(req.params.id)
        res.status(200).send({
            message: 'Product loaded.',
            product: product
        })
    } catch (error) {
        res.status(400).send({
            message: 'Can not fetch product from database.',
            error: error.message
        })
    }
}

const getProductVariants = async (req: Request, res: Response) => {
    const productService = new ProductService()
    try {
        const variants = await productService.getProductVariants(req.params.id)
        res.status(200).send({
            message: `Product with id ${req.params.id}`,
            variants: variants
        })
    } catch (error) {
        res.status(400).send({
            message: 'Can not fetch variants from database.',
            error: error.message
        })
    }
}

const updateProductImage = async (req: Request, res: Response) => {
    const productId = req.params.productId
    const productImage = req.file
    const productService = new ProductService()

    try {
        const product = await productService.updateProductImage(productId, productImage)
        res.status(200).send({
            message: 'Product image uploaded.',
            product
        })
    } catch (error) {
        res.status(400).send({
            message: 'Something went wrong',
            error: error.message
        })
    }
}

const updateVariant = async (req: Request, res: Response) => {
    const variantId = req.params.id
    const variantBody = req.body
    const productService = new ProductService()

    try {
        const variant = await productService.updateVariant(variantBody, variantId)
        res.status(200).send({
            message: `Variant with id ${variantId} updated.`, 
            variant 
        })
    } catch (error) {
        res.status(400).send({ message: 'Can not update variant.', error: error.message })
    }
}

const removeProduct = async (req: Request, res: Response) => {
    const productId = req.params.productId
    const productService = new ProductService()

    try {
        const removed = await productService.removeProduct(productId)
        res.status(200).send({
            message: `Product ${productId} removed.`, 
            removed
        })
    } catch (error) {
        res.status(400).send({ message: 'Can not remove product.', error: error.message })
    }
}

const updateProduct = async (req: Request, res: Response) => {
    const productBody = req.body
    const productId = req.params.id
    const productService = new ProductService()

    try {
        const product = await productService.updateProduct(productBody, productId)
        res.status(200).send({
            message: 'Product updated.',
            product: product
        })
    } catch (error) {
        res.status(400).send({
            message: 'Something went wrong',
            error: error.message
        })
    }
}

const getProductReviews = async (req:Request, res: Response) => {
    const productService = new ProductService()
    const productId = req.params.id

    try {
        const review = await productService.getProductReviews(productId)
        res.status(200).send({
            message: `Product ${productId} review`,
            review: review
        })
    } catch (error) {
        res.status(400).send({
            message: 'Something went wrong',
            error: error.message
        })
    }
}


export default { 
    addProduct,
    addProductCategory, 
    updateProductImage, 
    updateProduct,
    removeProduct, 
    getProducts, 
    getProduct, 
    getProductVariants,
    updateVariant,
    getProductReviews
}