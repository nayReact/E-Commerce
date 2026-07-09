import express from 'express'
import { protect, authorize } from '../middleware/authMiddleware.js'
import { getReturnRequests, requestReturn, updateReturnStatus } from '../controllers/returnController.js'

const router = express.Router()


router.post('/:orderId', protect, authorize('customer'), requestReturn)

router.put('/:orderId', protect, authorize('seller', 'admin'), updateReturnStatus)

router.get('/', protect, authorize('seller', 'admin'), getReturnRequests)

export default router