import express from 'express'
import { protect, authorize } from '../middleware/authMiddleware.js'
import {
    createReview,
    getProductReviews,
    deleteReview,
    checkCanReview
} from '../controllers/reviewController.js'

const router = express.Router()

router.post('/', protect, authorize('customer'), createReview)
router.get('/product/:productId', getProductReviews)
router.get('/can-review/:productId', protect, checkCanReview)
router.delete('/:id', protect, deleteReview)

export default router