import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import User from '../models/User.js'

const router = express.Router()

// Inline admin check — no authorize import needed
const adminOnly = (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin only' })
    }
    next()
}

router.get('/users', protect, adminOnly, async(req, res) => {
    try {
        const users = await User.find().sort('-createdAt')
        return res.status(200).json({ success: true, count: users.length, users })
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message })
    }
})

router.put('/users/:id', protect, adminOnly, async(req, res) => {
    try {
        const { isApproved, isActive, role } = req.body
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved, isActive, role },
            { returnDocument: 'after' }
        )
        if(!user) 
            return res.status(404).json({ success: false, message: 'User not found' })
        return res.status(200).json({ success: true, user })
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message })
    }
})

export default router