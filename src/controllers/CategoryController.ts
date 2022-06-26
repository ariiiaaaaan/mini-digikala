import { Request, Response } from 'express'
import { CategoryService } from '../services/CategoryService'

const addCategory = async (req: Request, res: Response) => {
    const categoryService = new CategoryService()
    const categoryName = req.body.name
    const categoryParentId = req.params.id
    try {
        const category = await categoryService.addCategory(categoryName, categoryParentId)
        res.status(200).send({
            message: 'Category added.',
            Category: category
        })
    } catch (error) {
        res.status(400).send({
            message: 'Something went wrong',
            error: error.message
        })
    }
}

const deleteCategory = async (req: Request, res: Response) => {
    const categoryService = new CategoryService()
    const categoryId = req.params.id
    try {
        const category = await categoryService.deleteCategory(categoryId)
        res.status(200).send({
            message: 'Category deleted.',
            Category: category
        })
    } catch (error) {
        res.status(400).send({
            message: 'Something went wrong',
            error: error.message
        })
    }
}

const readCategories = async (req: Request, res: Response) => {
    const categoryService = new CategoryService()
    try {
        const category = await categoryService.readCategories()
        res.status(200).send({
            message: 'Categories list',
            Category: category
        })
    } catch (error) {
        res.status(400).send({
            message: 'Can not read categories from db',
            error: error.message
        })
    }
}

const updateCategoryName = async (req: Request, res: Response) => {
    const categoryService = new CategoryService()
    const categoryId = req.params.categoryId
    const categoryName = req.body.name

    try {
        const category = await categoryService.updateCategoryName(categoryId, categoryName)
        res.status(200).send({
            message: 'Category name upadated',
            Category: category
        })
    } catch (error) {
        res.status(400).send({
            message: 'Can not update category, An error occured',
            error: error.message
        })
    }
}

export default {
    addCategory,
    deleteCategory,
    readCategories,
    updateCategoryName
}