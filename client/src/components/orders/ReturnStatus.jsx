const statusConfig = {
    pending: {
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: '⏳',
        label: 'Return Pending'
    },
    approved: {
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: '✅',
        label: 'Return Approved'
    },
    rejected : {
         color: 'bg-red-100 text-red-700 border-red-200',
        icon: '❌',
        label: 'Return Rejected'
    }
}
const refundConfig = {
    none: null,
    pending: { color: 'text-yellow-600', label: 'Refund Pending' },
    processed: { color: 'text-green-600', label: 'Refund Processed ✓' }
}

const ReturnStatus = ({ returnRequest, onUpdateStatus, canUpdate }) => {
    if(!returnRequest?.requested) return null

    const status = statusConfig[returnRequest.status] || statusConfig.pending
    const refund = refundConfig[returnRequest.refundStatus]

    return (
        <div className={`border rounded-2xl p-5 ${status.color}`}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{status.icon} </span>
                        <span className="font-bold"> {status.label}</span>
                    </div>

                    <div className="space-y-1 text-sm">
                        <p>
                            <span className="font-medium"> Reason: </span>
                            {' '}
                            {returnRequest.reason}
                        </p>
                        {returnRequest.description && (
                            <p>
                                <span className="font-medium">Details </span> 
                                {' '}
                                {returnRequest.description}
                            </p>
                        )}
                        <p>
                            <span className="font-medium">Requested: </span> {' '}
                            {new Date(returnRequest.requestedAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric' 
                            }) }
                        </p>
                        {refund && (
                            <p className={`font-semibold ${refund.color}`}>💳 {refund.label}</p>
                        )}
                    </div>
                </div>

                {/* seller/admin update buttons */}
                {canUpdate && returnRequest.status === 'pending' && (
                    <div className="flex flex-col gap-2">
                        <button onClick={() => onUpdateStatus('approved', 'pending')}
                            className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700 transition"> Approved </button>
                        <button  onClick={() => onUpdateStatus('rejected', 'none')}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition"> Rejected </button>
                    </div>
                )}

                {/* Mark refund processed */}
                {canUpdate && 
                    returnRequest.status === 'approved' && 
                    returnRequest.refundStatus === 'pending' && (
                        <button  onClick={() => onUpdateStatus('approved', 'processed')}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
                    >
                            Mark Refund Done
                        </button>
                    )}
            </div>
        </div>
    )
}

export default ReturnStatus