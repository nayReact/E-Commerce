import Order from "../models/Order.js";

export const requestReturn = async(req, res) => {
    try {
        const  { reason, description } = req.body
        const order = await Order.findById(req.params.orderId)

        if(!order) {
            return res.status(404).json({ success: false, message: 'Order not found'})
        }

        if(order.user.toString() !== order.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized'})
        } 

        if(order.status !== 'delivered') {
            return res.status(400).json({ success: false, message: 'Only delivered orders can be returned'})
        }

        const deliveredAt = order.statusHistory?.find( h => h.status === 'delivered')?. updatedAt || order.updatedAt

        const daysSinceDelivery = Math.floor(
            (new Date() - new Date(deliveredAt)) / (1000 * 60 * 60 * 24)
        )

        if(daysSinceDelivery > 7) {
            return res.status(400).json({ success: false, message: 'Return window of 7 days has expired'})
        }

        if(order.returnRequest?.requested) {
            return res.status(400).json({ success: false, message: 'Return already requested for this order '})
        }

        if(!reason) {
            return res.status(400).json({ success: false, message: 'Return reason is required'})
        }

        order.returnRequest = {
            requested: true,
            reason,
            description: description || '',
            requestedAt: new Date(),
            status: 'pending',
            refundStatus: 'none'
        }

        await order.save()

        return res.status(200).json({ success: true, message: 'Return request submitted successfully'})

    } catch(error) {
        return res.status(500).json({ success: false, message: error.message})
    }
}

export const updateReturnStatus = async( req, res) => {
    try {
        const { status, refundStatus } = req.body
        const order = await Order.findById(req.params.orderId)

        if(!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        if(!order.returnRequest?.requested) {
            return res.status(400).json({ success: false, message: 'No return request found for this order'})
        }

        order.returnRequest.status = status || order.returnRequest.status
        order.returnRequest.refundStatus = refundStatus || order.returnRequest.refundStatus
        order.returnRequest.resolvedAt = new Date()
        order.returnRequest.resolvedBy = req.user._id

        if(status == 'approved') {
            order.status = 'returned'
            order.statusHistory.push({
                status: 'returned',
                updatedAt: new Date(),
                updatedBy: req.user._id
            })
        }

        await order.save()
        return res.status(200).json({ success: true, message: `Return ${status} successfullly`, order })

    } catch(error) {
        return res.status(500).json({ success: false, message: error.message})
    }
}

export const getReturnRequests = async(req, res) => {
    try {
        const query = { 'returnRequest.requested' : true }

        if(req.user.role === 'seller') {
            query['item.seller'] = req.user._id
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.product', 'name image')
            .sort('-returnRequest.requestedAt')
        return res.status(200).json({ success: true, count: orders.length, orders })

    } catch(error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}