const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/errorHandler')
const cors = require('cors')
// Load environment variables early
require('dotenv').config()

//middleware
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(authJwt())
app.use(errorHandler)

//Environment variables
const api = process.env.API_URL || '/api/v1'
const mongoUri = process.env.MONGO_URI
const port = process.env.PORT || 3001

//MongoDB connection
mongoose
    .connect(mongoUri, { dbName: 'eshop-database' })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err)
    })

//Routes
const productsRouter = require('./routers/products')
app.use(`${api}/products`, productsRouter)

const categoryRouter = require('./routers/category')
app.use(`${api}/categories`, categoryRouter)

const usersRouter = require('./routers/users')
app.use(`${api}/users`, usersRouter)

const orderRouter = require('./routers/orders')
app.use(`${api}/orders`, orderRouter)

// Health check endpoint for Vercel (under API path)
app.get(`${api}/health`, (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' })
})

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'E-Commerce API is running',
        version: '1.0.0',
        endpoints: {
            health: `${api}/health`,
            products: `${api}/products`,
            categories: `${api}/categories`,
            users: `${api}/users`,
            orders: `${api}/orders`,
        },
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

module.exports = app
