import express from 'express'
import { protect, authorize } from '../middleware/authMiddleware.js'
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/categoryController.js'

const router = express.Router()
router.get('/', getCategories)
router.get('/:id', getCategory)

router.post('/', protect, authorize('admin'), createCategory)
router.put('/:id', protect,authorize('admin'), updateCategory)
router.delete('/:id', protect, authorize('admin'), deleteCategory)

export default router