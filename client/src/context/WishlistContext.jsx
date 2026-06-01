import { createContext, useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
} from '../api/wishlistAPI'
import toast from 'react-hot-toast'

export const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(null)
    const [loading, setLoading] = useState(false)
    const { user, initializing } = useContext(AuthContext)  // ← add initializing

    useEffect(() => {
        // Only fetch if auth is done initializing AND user is a customer
        if(!initializing && user && user.role === 'customer') {
            fetchWishlist()
        } else {
            setWishlist(null)
        }
    }, [user, initializing])  // ← add initializing to dependency array

    const fetchWishlist = async() => {
        setLoading(true)
        try {
            const { data } = await getWishlist()
            setWishlist(data.wishlist)
        } catch(error) {
            console.error('Fetch wishlist error:', error)
        } finally {
            setLoading(false)
        }
    }

    const add = async(productId) => {
        if(!user) {
            toast.error('Please login to save items')
            return
        }
        try {
            const { data } = await addToWishlist(productId)
            setWishlist(data.wishlist)
            toast.success('Added to wishlist ❤️')
        } catch(error) {
            toast.error(error?.response?.data?.message || 'Failed to add to wishlist')
        }
    }

    const remove = async(productId) => {
        try {
            const { data } = await removeFromWishlist(productId)
            setWishlist(data.wishlist)
            toast.success('Removed from wishlist')
        } catch(error) {
            toast.error('Failed to remove from wishlist')
        }
    }

    const clear = async() => {
        try {
            const { data } = await clearWishlist()
            setWishlist(data.wishlist)
            toast.success('Wishlist cleared')
        } catch(error) {
            toast.error('Failed to clear wishlist')
        }
    }

    const isInWishlist = (productId) => {
        return wishlist?.products?.some(
            item => item.product?._id === productId ||
                    item.product === productId
        ) || false
    }

    const wishlistCount = wishlist?.products?.length || 0

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            wishlistCount,
            fetchWishlist,
            add,
            remove,
            clear,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    )
}