import Review from '../models/Review.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

export const createReview = async(req, res) => {
    try {
        const { productId, rating, title, comment } = req.body

        // Check product exists
        const product = await Product.findById(productId)
        if(!product) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        // Check user has a delivered order containing this product
        const deliveredOrder = await Order.findOne({
            user: req.user._id,
            status: 'delivered',
            'items.product': productId
        })

        if(!deliveredOrder) {
            return res.status(403).json({
                success: false,
                message: 'You can only review products you have purchased and received'
            })
        }

        // Check already reviewed
        const existing = await Review.findOne({
            product: productId,
            user: req.user._id
        })
        if(existing) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            })
        }

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            order: deliveredOrder._id,
            rating,
            title,
            comment,
            isVerifiedPurchase: true
        })

        await review.populate('user', 'name avatar')

        return res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review
        })
    } catch(error) {
        // Handle duplicate review
        if(error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            })
        }
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getProductReviews = async(req, res) => {
    try {
        const { productId } = req.params
        const { page = 1, limit = 10 } = req.query

        const skip = (page - 1) * limit

        const [reviews, total] = await Promise.all([
            Review.find({ product: productId })
                .populate('user', 'name avatar')
                .sort('-createdAt')
                .skip(skip)
                .limit(Number(limit)),
            Review.countDocuments({ product: productId })
        ])

       

        return res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            reviews
        })
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteReview = async(req, res) => {
    try {
        const review = await Review.findById(req.params.id)

        if(!review) {
            return res.status(404).json({ success: false, message: 'Review not found' })
        }

        // Only review owner or admin can delete
        if(review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' })
        }

        await Review.findOneAndDelete({ _id: req.params.id })

        return res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        })
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const checkCanReview = async(req, res) => {
    try {
        const { productId } = req.params

        // Check delivered order
        const deliveredOrder = await Order.findOne({
            user: req.user._id,
            status: 'delivered',
            'items.product': productId
        })

        // Check existing review
        const existingReview = await Review.findOne({
            product: productId,
            user: req.user._id
        })

        return res.status(200).json({
            success: true,
            canReview: !!deliveredOrder && !existingReview,
            hasOrdered: !!deliveredOrder,
            hasReviewed: !!existingReview
        })
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}