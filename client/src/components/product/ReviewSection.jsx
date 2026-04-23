import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { getProductReviews, checkCanReview } from '../../api/reviewAPI'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'

const RatingBar = ({ star, count, total }) => (
    <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600 w-4">{star}</span>
        <span className="text-yellow-400">★</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{ width: total > 0 ? `${(count/total)*100}%` : '0%' }}
            />
        </div>
        <span className="text-gray-500 w-6 text-right">{count}</span>
    </div>
)

const ReviewSection = ({ product }) => {
    const { user } = useContext(AuthContext)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [canReview, setCanReview] = useState(false)
    const [hasReviewed, setHasReviewed] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        loadReviews()
    }, [page, product._id])

    useEffect(() => {
        if(user && user.role === 'customer') {
            checkCanReview(product._id)
                .then(({ data }) => {
                    setCanReview(data.canReview)
                    setHasReviewed(data.hasReviewed)
                })
                .catch(console.error)
        }
    }, [user, product._id])

    const loadReviews = async() => {
        setLoading(true)
        try {
            const { data } = await getProductReviews(product._id, { page, limit: 5 })
            setReviews(data.reviews || [])
            setTotalPages(data.pages || 1)
        } catch(error) {
            console.error('Load reviews error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleReviewAdded = (newReview) => {
        setReviews(prev => [newReview, ...prev])
        setCanReview(false)
        setHasReviewed(true)
    }

    const handleReviewDeleted = (reviewId) => {
        setReviews(prev => prev.filter(r => r._id !== reviewId))
    }

    // Rating breakdown from reviews
    const ratingCounts = [5,4,3,2,1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length
    }))

    return (
        <div className="mt-10 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Reviews & Ratings
            </h2>

            {/* Rating Summary */}
            {product.numReviews > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow p-6 mb-8 flex flex-col sm:flex-row gap-6">
                    {/* Average */}
                    <div className="text-center sm:border-r sm:pr-6">
                        <p className="text-6xl font-bold text-gray-800">
                            {product.rating?.toFixed(1)}
                        </p>
                        <div className="flex justify-center gap-0.5 my-2">
                            {[1,2,3,4,5].map(s => (
                                <span key={s} className={`text-2xl ${
                                    s <= Math.round(product.rating)
                                        ? 'text-yellow-400' : 'text-gray-200'
                                }`}>★</span>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">
                            {product.numReviews} reviews
                        </p>
                    </div>

                    {/* Breakdown bars */}
                    <div className="flex-1 space-y-2">
                        {ratingCounts.map(({ star, count }) => (
                            <RatingBar
                                key={star}
                                star={star}
                                count={count}
                                total={reviews.length}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Review Form */}
            {user && user.role === 'customer' && canReview && (
                <div className="mb-8">
                    <ReviewForm
                        productId={product._id}
                        onReviewAdded={handleReviewAdded}
                    />
                </div>
            )}

            {/* Status messages */}
            {user && user.role === 'customer' && hasReviewed && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
                    ✓ You have already reviewed this product
                </div>
            )}
            {user && user.role === 'customer' && !canReview && !hasReviewed && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                    Purchase and receive this product to leave a review
                </div>
            )}
            {!user && (
                <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-indigo-700">
                    Please login to write a review
                </div>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse">
                            <div className="flex gap-3 mb-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-24" />
                                    <div className="h-3 bg-gray-200 rounded w-16" />
                                </div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p className="text-4xl mb-2">💬</p>
                    <p>No reviews yet — be the first to review!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            onDeleted={handleReviewDeleted}
                        />
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40">
                                ← Prev
                            </button>
                            <span className="px-4 py-2 text-sm text-gray-600">
                                {page} / {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40">
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ReviewSection