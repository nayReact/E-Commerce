import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { deleteReview } from '../../api/reviewAPI'
import toast from 'react-hot-toast'

const StarDisplay = ({ rating }) => (
    <div className="flex gap-0.5">
        {[1,2,3,4,5].map(star => (
            <span key={star} className={`text-lg ${
                star <= rating ? 'text-yellow-400' : 'text-gray-200'
            }`}>★</span>
        ))}
    </div>
)

const ReviewCard = ({ review, onDeleted }) => {
    const { user } = useContext(AuthContext)

    const isOwner = user?._id === review.user?._id ||
                    user?.id === review.user?._id
    const isAdmin = user?.role === 'admin'

    const handleDelete = async () => {
        if(!window.confirm('Delete this review?')) return
        try {
            await deleteReview(review._id)
            toast.success('Review deleted')
            onDeleted(review._id)
        } catch(error) {
            toast.error('Failed to delete review')
        }
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <img src={review.user?.avatar}
                        alt={review.user?.name}
                        className="w-10 h-10 rounded-full object-cover border" />
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">
                            {review.user?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {review.isVerifiedPurchase && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            ✓ Verified
                        </span>
                    )}
                    {(isOwner || isAdmin) && (
                        <button onClick={handleDelete}
                            className="text-xs text-red-500 hover:underline">
                            Delete
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-3">
                <StarDisplay rating={review.rating} />
                {review.title && (
                    <p className="font-semibold text-gray-800 mt-2">{review.title}</p>
                )}
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    {review.comment}
                </p>
            </div>
        </div>
    )
}

export default ReviewCard