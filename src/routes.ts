import { Express, Request, Response } from 'express'
import userController from './controllers/UserController'
import productController from './controllers/ProductController'
import categoryController from './controllers/CategoryController'
import { upload } from './utils/multer'
import OrderController from './controllers/OrderController'
import authMiddleware from './middlewares/AuthMiddleware'
import checkUserRole from './middlewares/CheckRoleMiddleware'

const routes = (app: Express) => {
  /**
   * @openapi
   * /test:
   *   get:
   *     tags:
   *       - App health check
   *     description: Responds OK if app is up and running
   *     responses:
   *       200:
   *         description: app is up and running
   */
  app.get('/test', (req: Request, res: Response) => { res.sendStatus(200) })
  /**
   * @openapi
   * /api/users/register:
   *  post:
   *    tags:
   *      - Users
   *    summary: Registering a user
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              mobileNumber:
   *                type: string
   *                example: '09355567134'
   *    responses:
   *      201: 
   *        description: Account created, Login code has been sent to mobile number
   *        content:
   *          applicaton/json:
   *            schema:
   *              type: object
   *              properties:
   *                mobileNumber: 
   *                  type: string
   *                OTPNumber: 
   *                  type: string
   *                id:
   *                  type: string
   *                createdAt: 
   *                  type: string
   *                updatedAt: 
   *                  type: string
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  tyoe: string
   *                error:
   *                  type: string
   */
  app.post('/api/users/register', userController.register)
   /**
   * @openapi
   * /api/users/verifyUser:
   *  post:
   *    tags:
   *      - Users
   *    summary: Verifying user with otp number and creating a profile
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              mobileNumber:
   *                type: string
   *                example: '09355567134'
   *              mobileOTP:
   *                type: string
   *                example: '789654'
   *    responses:
   *      200:
   *        description: user verified
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                user:
   *                  type: object
   *                token:
   *                  type: string
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  tyoe: string
   *                error:
   *                  type: string
   */
  app.post('/api/users/verifyUser', userController.verifyStoredUser)
  /**
   * @openapi
   * /api/users/login:
   *  get:
   *    tags:
   *      - Users
   *    summary: login with phone number
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              mobileNumber:
   *                type: string
   *                example: '09355567134'
   *    responses:
   *      200:
   *        description: OTP sent for user's phone
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                user:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  tyoe: string
   *                error:
   *                  type: string
   */
  app.post('/api/users/login', userController.login)
  /**
   * @openapi
   * /api/users/verifyOTP:
   *  post:
   *    tags:
   *      - Users
   *    summary: login user with otp
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              mobileNumber:
   *                type: string
   *                example: '09355567134'
   *              mobileOTP:
   *                type: string
   *                example: '789654'
   *    responses:
   *      200:
   *        description: login success
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                user:
   *                  type: object
   *                token:
   *                  type: string
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   */
  app.post('/api/users/verifyOTP', userController.verifyOTP)
  /**
   * @openapi
   * /api/users/updateProfile:
   *  patch:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Users
   *    summary: Update user's profile
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              firstName:
   *                type: string
   *                example: 'Ahmad'
   *              lastName:
   *                type: string
   *                example: 'Ahmadi'
   *              email: 
   *                type: string
   *                example: 'test@gmail.com'
   *              address: 
   *                type: string
   *                example: '6th street, Tehran, Iran'
   *    responses:
   *      200:
   *        description: User profile updated
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                user:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   */
  app.patch('/api/users/updateProfile', authMiddleware, userController.updateProfile)
  /**
   * @openapi
   * /api/users/updateUserRole:
   *  patch:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Users
   *    summary: Toggle user role
   *    responses:
   *      200:
   *        description: User's role updated
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                user:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   */
  app.patch('/api/users/updateUserRole', authMiddleware, userController.updateUserRole)
  /**
   * @openapi
   * /api/users/me:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Users
   *    summary: Get logged in user's profile
   *    responses:
   *      200:
   *        description: User information
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                user:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *                
   */
  app.get('/api/users/me', authMiddleware, userController.getUser)
  /**
   * @openapi
   * /api/users/addFavorite/{id}:
   *  post:
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Users
   *    summary: User favorite product with given id
   *    responses:
   *      200:
   *        description: User added product to favorites list
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                user:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   */
  app.post('/api/users/addFavorite/:id', authMiddleware, userController.addFavorite)
  /**
   * @openapi
   * /api/users/getFavorites:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Users
   *    summary: List of user's favorite products
   *    responses:
   *      200:
   *        description: Favorites list
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                favorites:
   *                  type: array
   *                  items:
   *                    type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   */
  app.get('/api/users/getFavorites/', authMiddleware, userController.getFavorites)
  /**
   * @openapi
   * /api/users/removeFavorite/{id}:
   *  delete:
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Users
   *    summary: Delete favorite product from list
   *    responses:
   *      200:
   *        description: Favorites list
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                user:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   * 
   */
  app.delete('/api/users/removeFavorite/:id', authMiddleware, userController.removeFavorite)
  /**
   * @openapi
   * /api/users/productReview/{id}:
   *  post:
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Users
   *    summary: User's review for product
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              rating:
   *                type: number
   *                example: 5
   *              description:
   *                type: string
   *                example: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
   *    responses:
   *      200:
   *        description: Review added
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                review:
   *                  type: object
   *                product:
   *                  type: object
   *                productId:
   *                  type: number
   *                userId: 
   *                  type: number
   *                productToReviewId: 
   *                  type: number
   *                createdAt: 
   *                  type: string
   *                  format: date
   *                updatedAt:
   *                  type: string
   *                  format: date
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   * 
   */
  app.post('/api/users/productReview/:id', authMiddleware, userController.productReview)
  /**
   * @openapi
   * /api/cart/addToCart/{variantId}:
   *  post:
   *    parameters:
   *      - in: path
   *        name: variantId
   *        required: true
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Users
   *    summary: Add product variant to cart
   *    responses:
   *      200:
   *        description: Product added to cart
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                order:
   *                  type: object
   *                orderItem:
   *                  type: array
   *                  items:
   *                    type: object
   *                id:
   *                  type: number
   *                createdAt: 
   *                  type: string
   *                  format: date
   *                updatedAt:
   *                  type: string
   *                  format: date
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   */
  app.post('/api/cart/addToCart/:variantId', authMiddleware, OrderController.addToCart)
  /**
   * @openapi
   * /api/cart/getCart:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Users
   *    summary: Get user's shopping cart
   *    responses:
   *      200:
   *        description: Shopping cart
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                order:
   *                  type: object
   *                orderItem:
   *                  type: array
   *                  items:
   *                    type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *    
   */
  app.get('/api/cart/getCart', authMiddleware, OrderController.getCart)
  /**
   * @openapi
   * /api/cart/removeFromCart/{variantId}:
   *  delete:
   *    parameters:
   *      - in: path
   *        name: variantId
   *        required: true
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Users
   *    summary: Get user's shopping cart
   *    responses:
   *      200:
   *        description: Shopping cart
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                order:
   *                  type: object
   *                orderItem:
   *                  type: array
   *                  items:
   *                    type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *    
   */
  app.delete('/api/cart/removeFromCart/:variantId', authMiddleware, OrderController.removeFromCart)
  /**
   * @openapi
   * /api/cart/checkout:
   *  patch:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Users
   *    summary: Complete shopping
   *    responses:
   *      200:
   *        description: Payment completed
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                order:
   *                  type: object
   *                orderItem:
   *                  type: array
   *                  items:
   *                    type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *    
   */
  app.patch('/api/cart/checkout', authMiddleware, OrderController.checkout)
  /**
   * @openapi
   * /api/addProduct/{categoryId}:
   *  post:
   *    parameters:
   *      - in: path
   *        name: categoryId
   *        allowEmptyValue: true
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Add product with optional categoryId, if categoryId provided, it will also add category relation for product
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              title:
   *                type: string
   *                example: 'T-shirt'
   *              description:
   *                type: string
   *                example: 'New set from BRAND'
   *              variants:
   *                type: array
   *                items:
   *                  type: object
   *                  properties:
   *                    color:
   *                      type: string
   *                    size:
   *                      type: string
   *                    price:
   *                      type: number
   *                example:
   *                  - color: 'White'
   *                    size: 'S'
   *                    price: 150
   *                  - color: 'Red'
   *                    size: 'L'
   *                    price: 220
   *    responses:
   *      200:
   *        description: Product added
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                product:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.post('/api/addProduct/:categoryId?', authMiddleware, checkUserRole, productController.addProduct)
  /**
   * @openapi
   * /api/addProductCategory/{productId}/{categoryId}:
   *  patch:
   *    parameters:
   *      - in: path
   *        name: productId
   *        required: true
   *      - in: path
   *        name: categoryId
   *        required: true
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Add product category
   *    responses:
   *      200:
   *        description: Product category added
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                product:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.patch('/api/addProductCategory/:productId/:categoryId', authMiddleware, checkUserRole, productController.addProductCategory)
  /**
   * @openapi
   * /api/addProductImage/{productId}:
   *  put:
   *    parameters:
   *      - in: path
   *        name: productId
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Add image for given productId
   *    requestBody:
   *      content:
   *        multipart/form-data:
   *          schema:
   *            type: object
   *            properties:
   *              image:
   *                type: string
   *                format: binary
   *    responses:
   *      200:
   *        description: Product image added
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                product:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.put('/api/addProductImage/:productId', authMiddleware, checkUserRole, upload.single('image'), productController.updateProductImage)
  /**
   * @openapi
   * /api/getProduct/{productId}:
   *  get:
   *    parameters:
   *      - in: path
   *        name: productId
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Get product with given id
   *    responses:
   *      200:
   *        description: Product loaded
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                product:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.get('/api/getProduct/:id', authMiddleware, checkUserRole, productController.getProduct)
  /**
   * @openapi
   * /api/getAllProducts:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Get products list
   *    responses:
   *      200:
   *        description: Products list
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                product:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.get('/api/getAllProducts', authMiddleware, checkUserRole, productController.getProducts)
  /**
   * @openapi
   * /api/removeProduct/{productId}:
   *  delete:
   *    parameters:
   *      - in: path
   *        name: productId
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Remove product with given id
   *    responses:
   *      200:
   *        description: Product deleted
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                product:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.delete('/api/removeProduct/:productId', authMiddleware, checkUserRole, productController.removeProduct)
  /**
   * @openapi
   * /api/updateProduct/{productId}:
   *  patch:
   *    parameters:
   *      - in: path
   *        name: productId
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Update product 
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              title:
   *                type: string
   *                example: 'updated T-shirt'
   *    responses:
   *      200:
   *        description: Product updated
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                product:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.patch('/api/updateProduct/:id', authMiddleware, checkUserRole, productController.updateProduct)
   /**
   * @openapi
   * /api/getProductVariants/{productId}:
   *  get:
   *    parameters:
   *      - in: path
   *        name: productId
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Read given product's variants 
   *    responses:
   *      200:
   *        description: Variants list
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                variant:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.get('/api/getProductVariants/:id', authMiddleware, checkUserRole, productController.getProductVariants)
  /**
   * @openapi
   * /api/updateVariant/{variantId}:
   *  patch:
   *    parameters:
   *      - in: path
   *        name: variantId
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Update variant with given id 
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              color:
   *                type: string
   *                example: 'Black'
   *    responses:
   *      200:
   *        description: Variant updated
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                variant:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.patch('/api/updateVariant/:id', authMiddleware, checkUserRole, productController.updateVariant)
   /**
   * @openapi
   * /api/getProductReviews/{productId}:
   *  get:
   *    parameters:
   *      - in: path
   *        name: productId
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Read given product's reviews 
   *    responses:
   *      200:
   *        description: Reviews list
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                product:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.get('/api/getProductReviews/:id', authMiddleware, checkUserRole, productController.getProductReviews)
  /**
   * @openapi
   * /api/addCategory/{parentCategoryId}:
   *  post:
   *    parameters:
   *      - in: path
   *        name: parentCategoryId
   *        allowEmptyValue: true
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Add category with optional parentCategoryId, if parameter is empty, it will add root category otherwise it will add subcategory for given parameter id
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *                example: 'Shirts'
   *    responses:
   *      200:
   *        description: category added
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                category:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.post('/api/addCategory/:id?', authMiddleware, checkUserRole, categoryController.addCategory)
  /**
   * @openapi
   * /api/readCategories:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Read all categories 
   *    responses:
   *      200:
   *        description: Categories
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                categories:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.get('/api/readCategories', authMiddleware, checkUserRole, categoryController.readCategories)
  /**
   * @openapi
   * /api/deleteCategory/{categoryId}:
   *  delete:
   *    parameters:
   *      - in: path
   *        name: categoryId
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Remove category with its sub categories
   *    responses:
   *      200:
   *        description: Category deleted
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                category:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.delete('/api/deleteCategory/:id', authMiddleware, checkUserRole, categoryController.deleteCategory)
  /**
   * @openapi
   * /api/updateCategoryName/{categoryId}:
   *  patch:
   *    parameters:
   *      - in: path
   *        name: categoryId
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Products
   *    summary: Update category name 
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *                example: 'New Category Name'
   *    responses:
   *      200:
   *        description: Category updated
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                category:
   *                  type: object
   *      400:
   *        description: An error occured
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message: 
   *                  type: string
   *                error:
   *                  type: string
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Unauthorized role
   */
  app.patch('/api/updateCategoryName/:categoryId', authMiddleware, checkUserRole, categoryController.updateCategoryName)
}

export default routes