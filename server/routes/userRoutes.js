import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { addAddress, deleteAddress, getProfile, setDefaultAddress, updateAddress, updateProfile } from '../controllers/userController.js'

const router = express.Router()

router.get('/profile', protect, getProfile )
 
router.put('/profile', protect,updateProfile )

router.post('/profile/address', protect,addAddress )

router.put('/profile/address/:addressId', protect,updateAddress )

router.delete('/profile/address/:addressId', protect, deleteAddress)

router.put('/profile/address/:addressId/default', protect, setDefaultAddress)

export default router