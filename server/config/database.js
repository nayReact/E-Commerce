import mongoose from 'mongoose'
const connectDatabase =async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to database : ${conn.connection.host}`)
        console.log(`Database : ${conn.connection.name}`)
    } catch(error) {
        console.error(`Database connection error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDatabase