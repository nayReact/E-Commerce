import express from 'express'
import { protect, authorize } from '../middleware/authMiddleware.js'
import {uploadMultiple} from '../middleware/uploadMiddleware.js'
import { createProduct, getProduct, getProducts, getSellerProducts, updateProduct, deleteProduct } from '../controllers/productController.js'

const router = express.Router()
router.get('/', getProducts)
router.get('/:id', getProduct)

router.post('/', protect, authorize('seller', 'admin'), uploadMultiple, createProduct)
router.get('/seller/me', protect, authorize('seller', 'admin'), getSellerProducts)
router.put('/:id', protect, authorize('seller', 'admin'), uploadMultiple, updateProduct)
router.delete('/:id', protect, authorize('seller','admin'), deleteProduct)

export default router
