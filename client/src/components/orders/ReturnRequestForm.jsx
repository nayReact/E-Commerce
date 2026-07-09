import { useState } from 'react'
import { requestReturn } from '../../api/returnAPI'
import toast from 'react-hot-toast'

const RETURN_REASONS = [
    'Item damaged or defective',
    'Wrong item delivered',
    'Item not as described',
    'Changed my mind',
    'Quality not satisfactory',
    'Item arrived too late',
    'Other'
]

const ReturnRequestForm = ({ order, onSuccess, onClose }) => {
    const [reason, setReason] = useState('')
    const [description, setDescription] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!reason) {
            toast.error('Please select a return reason')
            return
        }
        setSubmitting(true)
        try {
            const { data } = await requestReturn(order._id, {
                reason,
                description
            })
            toast.success('Return request submitted!')
            onSuccess(data.order)
        } catch(error) {
            toast.error(
                error?.response?.data?.message || 'Failed to submit return request'
            )
        } finally {
            setSubmitting(false)
        }
    }

return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            
            {/* Header - fixed */}
            <div className="flex items-center justify-between p-6 pb-4">
                <h3 className="text-lg font-bold text-gray-800">
                    Request Return / Refund
                </h3>
                <button onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-xl">
                    ✕
                </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-6 flex-1">
                {/* Order Info */}
                <div className="bg-gray-50 rounded-xl p-3 mb-5 text-sm">
                    <p className="font-semibold text-gray-700">
                        Order #{order.orderNumber}
                    </p>
                    <p className="text-gray-500">
                        ₹{order.totalPrice?.toFixed(2)} •{' '}
                        {order.items?.length} item{order.items?.length > 1 ? 's' : ''}
                    </p>
                </div>

                <form id="return-form" onSubmit={handleSubmit} className="space-y-4">
                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Reason for Return *
                        </label>
                        <div className="space-y-2">
                            {RETURN_REASONS.map(r => (
                                <label key={r}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                        reason === r
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={r}
                                        checked={reason === r}
                                        onChange={() => setReason(r)}
                                        className="accent-indigo-600"
                                    />
                                    <span className="text-sm text-gray-700">{r}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Additional Details (optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe the issue in detail..."
                            rows={3}
                            maxLength={500}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none text-sm"
                        />
                        <p className="text-xs text-gray-400 text-right">
                            {description.length}/500
                        </p>
                    </div>

                    {/* Policy note */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
                        ⏱ Returns are accepted within <strong>7 days</strong> of delivery.
                        Refunds are processed within 5-7 business days after approval.
                    </div>
                </form>
            </div>

            {/* Buttons - fixed footer, always visible */}
            <div className="flex gap-3 p-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={onClose}
                    className="flex-1 border border-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" form="return-form" disabled={submitting}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60">
                    {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
            </div>
        </div>
    </div>
)
}

export default ReturnRequestForm