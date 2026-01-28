import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDatabase from './config/database.js'
import authRoutes from './routes/authRoutes.js'

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
//to start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})