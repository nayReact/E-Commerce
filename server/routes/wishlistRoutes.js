import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { addToWishlist, checkWishlist, clearWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js'

const router = express.Router()

router.use(protect)

router.get('/', getWishlist)
router.post('/', addToWishlist)
router.delete('/clear', clearWishlist)
router.delete('/:productId', removeFromWishlist)
router.get('/check/:productId', checkWishlist)

export default router