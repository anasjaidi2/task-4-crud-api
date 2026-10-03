const express = require('express')
const connectDatabase = require('./db/mongoose')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)

app.use((req, res) => {
    res.status(404).send({ error: 'Route not found' })
})

async function startServer() {
    try {
        await connectDatabase()
        app.listen(port, () => {
            console.log('Server is running on port ' + port)
        })
    } catch (error) {
        console.log('Unable to connect to MongoDB:', error.message)
        process.exit(1)
    }
}

startServer()
