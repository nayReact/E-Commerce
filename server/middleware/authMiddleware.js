import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async(req, res, next) => {
    try {
        const token = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.slice(7)
            : null
            console.log('Protect - Token present:', !!token) 
        if(!token) {
            return res.status(401).json({ success: false, message: 'No token' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
         console.log('Protect - Decoded:', decoded) 
        req.user = await User.findById(decoded.id)
        

        if(!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' })
        }

        next()
    } catch(error) {
         
        return res.status(401).json({ success: false, message: 'Invalid token' })
    }
}
export const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                success:false,
                message: `User role '${req.user.role}' is not authorized to access`
            })
        }
        next()
    }
}