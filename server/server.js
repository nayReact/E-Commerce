import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDatabase from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config() // for env variable
connectDatabase()

const app = express()
app.use(cors()) //cors for frontend communication

app.use(express.json()) //body parser-increase limit for image

app.get('/', (req, res) => {  //api for health check
    return res.json({ 
        message: 'API is running',  
    })
})
app.use('/api/auth', authRoutes)   //mount route
app.use('/api/categories',categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
//to start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})