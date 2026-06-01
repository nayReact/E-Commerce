import Wishlist from '../models/Wishlist.js'

const populateOptions = {
    path: 'products.product',
    select: 'name price finalPrice discount image stock status isActive category seller',
    populate: {path: 'category', select: 'name slug'}
}

export const getWishlist = async(req, res) => {
    try {
       

        let wishlist = await Wishlist.findOne({ user: req.user._id })
        d
        
        if(!wishlist) {
            console.log('Creating new wishlist') // ← add
            wishlist = await Wishlist.create({ user: req.user._id, products: [] })
        }
        
        await wishlist.populate(populateOptions)

        const activeProducts = wishlist.products.filter(
            item => item.product && item.product.isActive
        )

        return res.status(200).json({
            success: true,
            count: activeProducts.length,
            wishlist: { ...wishlist.toObject(), products: activeProducts }
        })
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const addToWishlist = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            })
        }
        const { productId } = req.body

        let wishlist = await Wishlist.findOne({ user: req.user._id}) 

        if(!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: [{ product: productId }]
            })
  
        } else {
            const exists = wishlist.products.some(          // check if already in wishlist
                item => item.product.toString() === productId
            )

            if(exists) {
                return res.status(400).json({ success: false, message: 'Product already in wishlist '})
            }
            wishlist.products.push({ product: productId })
            await wishlist.save()
  
        }
        await wishlist.populate(populateOptions)

        return res.status(200).json({ success: true, message: 'Added to wishlist', wishlist})
        
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

 export const removeFromWishlist = async(req, res) => {
    try {
        const {productId} = req.params

        const wishlist = await Wishlist.findOne( {user: req.user._id })

        if(!wishlist){
            return res.status(404).json({ success: false, message: 'wishlist not found' })
        }

        wishlist.products = wishlist.products.filter(item => item.product.toString() !== productId )
        await wishlist.save()
        await wishlist.populate(populateOptions)

        return res.status(200).json({ success: true, message: "removed from wishlist " })

    } catch(error) {
        return res.status(500).json({ success: false, message: error.message })
    }
 }

 export const checkWishlist = async(req, res) => {
    try {
        const {productId} = req.params 
        const wishlist = await Wishlist.findOne({ user: req.user._id })

        const isInWishlist = wishlist?.products.some(
            item => item.product.toString() === productId
        ) || false
        return res.status(200).json({ success: true, isInWishlist })
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message })
    }
 }

 export  const clearWishlist = async(req, res) => {
    try{ 
        const wishlist = await Wishlist.findOne({ user: req.user._id })

        if(!wishlist ) {
            return res.status(404).json({ success: false, message: "Wishlist not found" })
        }

        wishlist.product = []
        await wishlist.save()
        return res.status(200).json({ success: true, message: "wishlist cleared ", wishlist })

    } catch(error) {
        return res.status(500).json({ success: false, message: error.message })
    }
 }