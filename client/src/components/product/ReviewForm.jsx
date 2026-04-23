import { useState } from 'react'
import { createReview } from '../../api/reviewAPI'
import toast from 'react-hot-toast'

const StarPicker = ({ value, onChange }) => (
    <div className="flex gap-1">
        {[1,2,3,4,5].map(star => (
            <button key={star} type="button" onClick={() => onChange(star)}
                className={`text-3xl transition hover:scale-110 ${
                    star <= value ? 'text-yellow-400' : 'text-gray-200'
                }`}>
                ★
            </button>
        ))}
    </div>
)

const ReviewForm = ({ productId, onReviewAdded }) => {
    const [formData, setFormData] = useState({
        rating: 0, title: '', comment: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(formData.rating === 0) {
            toast.error('Please select a rating')
            return
        }
        if(!formData.comment.trim()) {
            toast.error('Please write a review comment')
            return
        }
        setSubmitting(true)
        try {
            const { data } = await createReview({
                productId,
                ...formData
            })
            toast.success('Review submitted!')
            onReviewAdded(data.review)
            setFormData({ rating: 0, title: '', comment: '' })
        } catch(error) {
            toast.error(error?.response?.data?.message || 'Failed to submit review')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Star Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Your Rating *
                    </label>
                    <StarPicker
                        value={formData.rating}
                        onChange={v => setFormData(p => ({ ...p, rating: v }))}
                    />
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Review Title
                    </label>
                    <input type="text"
                        value={formData.title}
                        onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Great product!"
                        maxLength={100}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white" />
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Your Review *
                    </label>
                    <textarea
                        value={formData.comment}
                        onChange={e => setFormData(p => ({ ...p, comment: e.target.value }))}
                        placeholder="Share your experience with this product..."
                        rows={4} maxLength={1000}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none bg-white" />
                    <p className="text-xs text-gray-400 text-right mt-1">
                        {formData.comment.length}/1000
                    </p>
                </div>

                <button type="submit" disabled={submitting}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    )
}

export default ReviewForm