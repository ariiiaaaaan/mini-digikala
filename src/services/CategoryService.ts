import { DeleteResult, getTreeRepository, TreeRepository, getManager } from 'typeorm'
import { Category } from '../models/entity/Category'

export class CategoryService {
    private categoryRepossitory: TreeRepository<Category>

    constructor(categoryRepossitory: TreeRepository<Category> = getTreeRepository(Category)) {
        this.categoryRepossitory = categoryRepossitory
    }

    public async addCategory(name: string, parentId?: string): Promise<Category> {
        const category = new Category()
        
        if(parentId !== undefined) {
            const parent = await this.findCategoryById(parentId)
            if(parent === undefined) {
                throw new Error(`Can not find category with id ${parentId}`)
            }
            if(await this.isDuplicateCategory(name, parent)) {
                throw new Error('Duplicate subcategory name')
            }
            category.parent = parent
        } else if(await this.isDuplicateCategory(name)) {
            throw new Error('Duplicate category name')
        }

        category.name = name
        return await this.categoryRepossitory.save(category)
    }

    public async deleteCategory(categoryId: string): Promise<Category[]> {
        const ids = await this.categoryRepossitory.createQueryBuilder('category').where('id = :id', { id: categoryId }).getMany()
        const result = await this.categoryRepossitory.remove(ids)
        if(result.length === 0) {
            throw new Error(`Can not find category with id ${categoryId}`)
        }
        return result
    }

    public async updateCategoryName(categoryId: string, categoryName: string): Promise<Category> {
        const category = await this.findCategoryById(categoryId)
        category.name = categoryName
        return await this.categoryRepossitory.save(category)
    }

    public async readCategories(): Promise<Category[]> {
        const categories = this.categoryRepossitory.findTrees()
        if(!categories) {
            throw new Error('Category list is empty.')
        }
        return categories
    }

    private async isDuplicateCategory(name: string, parent?: Category): Promise<Boolean> {
        const categories = (parent === undefined) ? await this.categoryRepossitory.findRoots() : await this.categoryRepossitory.findDescendants(parent)
        return categories.map(category => category.name).includes(name)
    }

    private async findCategoryById(categoryId: string): Promise<Category>  {
        return await this.categoryRepossitory.createQueryBuilder('category').where('id = :id', { id: categoryId }).getOne()
    }
}