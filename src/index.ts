import express from 'express'
import dotenv from 'dotenv'
import connect from './utils/connect'
import routes from './routes'
import swaggerDocs from './utils/swagger'

dotenv.config()

const app = express()
app.use(express.json())
const port = process.env.PORT

app.listen(port, () => { 
    console.log('Server is up on port ' + port) 
    connect()
    routes(app)
    swaggerDocs(app, port)
})

