import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDatabase from './config/database.js'

dotenv.config() // for env variable
connectDatabase()

const app = express()
app.use(cors({ origin: process.env.CLIENT_URI, credentials: true})) //cors for frontend communication

app.use(express.json({ limit: '10mb'})) //body parser-increase limit for image
app.use(express.urlencoded({ extended: true, limit: '10mb'}))

app.use((req, res, next) => {   // req loader
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${req.method} ${req.path}`)
    next()
})

app.get('/', (req, res) => {  //api for health check
    res.json({ success: true, message: 'API is running', environment: process.env.NODE_ENV})
})

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API working',
        timestamp: new Date()
    })
})

app.use((req, res) => {     // for error
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    })
})

app.use((err, req, res, next) => { // Global error handling
    console.log("error: ", err.stack)
    res. status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...app(process.env.NODE_ENV === 'development' && {stack: err.stack })
    })
})
//to start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})