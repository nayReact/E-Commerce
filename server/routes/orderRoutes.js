import express from 'express'
import {protect, authorize} from '../middleware/authMiddleware.js'
import { cancelOrder, createOrder, getAllOrders, getMyOrders, getOrder, getSellerOrders, updateOrderStatus } from '../controllers/orderController.js'

const router = express.Router()
//customer routes
router.post('/', protect, createOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/seller/me', protect, authorize('seller', 'admin'), getSellerOrders)

// /:id routes must come AFTER named routes
router.get('/:id', protect, getOrder)
router.put('/:id/cancel', protect, cancelOrder)        // ← is this present?
router.put('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus)

router.get('/', protect, authorize('admin'), getAllOrders)
export default router