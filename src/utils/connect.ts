import { createConnection } from 'typeorm'

const connect = async () => {
    try {
        await createConnection()
        console.log('DB Connected')
    } catch (error) {
        console.log('Could not connect to db', error)
        process.exit(1)
    }
}

export default connect