import { useContext } from 'react'
import { WishlistContext } from '../../context/WishlistContext'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const WishlistButton = ({ productId, className = '' }) => {
    const { isInWishlist, add, remove } = useContext(WishlistContext)
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const inWishlist = isInWishlist(productId)

    const handleToggle = async(e) => {
        e.preventDefault()
        e.stopPropagation()

        if(!user) {
            navigate('/login')
            return
        }

        if(user.role !== 'customer') return

        if(inWishlist) {
            await remove(productId)
        } else {
            await add(productId)
        }
    }

   
    if(user && user.role !== 'customer') return null

    return (
        <button
            onClick={handleToggle}
            className={`transition-all duration-200 hover:scale-110 ${className}`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <svg
                className={`w-6 h-6 transition-colors ${
                    inWishlist
                        ? 'fill-red-500 stroke-red-500'
                        : 'fill-none stroke-gray-400 hover:stroke-red-400'
                }`}
                viewBox="0 0 24 24"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        </button>
    )
}

export default WishlistButton