import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

const restoreStock = async(items) => {
    await Promise.all(
        items.map(item => 
            Product.findByIdAndUpdate(
                item.product,
               { $inc: { stock: item.quantity }} 
            )
        )
    )
}

export const createOrder = async(req, res) => {
    try{ 
        const { shippingAddress } = req.body
        if(!shippingAddress?.street || !shippingAddress.city ||!shippingAddress?.pin || !shippingAddress?.phone) {
            return res.status(400).json({
                success: false,
                message: 'Incomplete shipping address'
            })
        }

        const cart = await Cart.findOne({user: req.user._id})
            .populate('items.product')
        
            if(!cart?.items.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Cart is empty'
                })
            }

            const productIds = cart.items.map (
                i => i.product._id
            )
            const products = await Product.find({
                _id: {$in: productIds}
            })
            const productMap = new Map(products.map(
                p=> [p._id.toString(), p]
            ))
            const orderItems = cart.items.map(item => {
                const product = productMap.get(item.product._id.toString())

                if(!product || !product.isActive || product.status !== 'active') {
                    throw new Error(`${item.product.name} is unavailable`)
                }

                if(product.stock < item.quantity) {
                    throw new Error(`Only ${product.stock} of ${product.name} is available`)
                }

                return {
                    product: product._id,
                    name: product.name,
                    price: product.finalPrice,
                    quantity: item.quantity,
                    image: (product.images && product.images.length > 0) ? product.images[0].url : '',
                    seller: product.seller
                }
            })

            const itemsPrice = orderItems.reduce((sum, i) => sum+i.price*i.quantity, 0)
            const shippingPrice = itemsPrice > 500 ? 0:50

            const order = await Order.create({
                user: req.user._id,
                items: orderItems,
                shippingAddress,
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                itemsPrice,
                shippingPrice,
                totalPrice: itemsPrice + shippingPrice
            })

            await Promise.all(
                orderItems.map(item => 
                    Product.findByIdAndUpdate(item.product, { $inc: {stock: -item.quantity}}) 
                )
            )
            cart.items = []
            await cart.save()

            return res.status(201).json({
                success: true,
                message: 'Order placed successfully', 
                order
            })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

export const getOrder = async(req, res) => {
    try{
        const order = await Order.findById(req.params.id)
        .populate('user', 'name email phone')
        .populate('items.product', 'name images')
        .populate('items.seller', 'name email')

        if(!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }
        const isOwner = order.user._id.toString() === req.user._id.toString()
        const isSeller = order.items.some(i => i.seller.toString() === req.user._id.toString())

        if(!isOwner && req.user.role !== 'admin' && !isSeller) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            })
        }
        return res.status(200).json({
            success: true,
            order
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getMyOrders = async(req, res) => {
    try{
        const orders = await Order.find({user: req.user._id})
        .populate('items.product', 'name images')
        .sort('-createdAt')

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateOrderStatus = async(req, res) => {
    try{
        const {status, trackingNumber, note } = req.body
        const {orderNumber} = req.params
        const order = await Order.findOne(orderNumber)

        if(!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        const isSeller = order.items.some(
            i => i.seller.toString() === req.user._id.toString());

        if (req.user.role !== 'admin' && !isSeller) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        order.status = status
        if(trackingNumber) {
            order.trackingNumber = trackingNumber
        }
        if(order.status === 'delivered') {
            order.deliveredAt = new Date()
            order.paymentStatus = 'success'
        }
        if(status === 'cancelled') {
            order.cancelledAt = new Date()
            await restoreStock(order.items)
        }
        order.statusHistory.push({
            status,
            date: new Date(),
            note: note || `Order ${status}`
        })
        await order.save()

        return res.status(200).json({
            success: true,
            message: 'Order updates',
            order
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const cancelOrder = async(req, res) => {
    try{
        const {id} = req.params
        const order = await Order.findOne({
            orderNumber: id
        }) 
        if(!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }
        if(order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            })
        }
        if (order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Order already cancelled'
            })
}
        if(['shipped','delivered'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: 'Can not cancel shipped order'
            })
        }

        order.status = 'cancelled'
        order.cancelledAt = new Date()
        order.cancellationReason = req.body.reason 

        await restoreStock(order.items)

        order.statusHistory.push({
            status: 'cancelled',
            date: new Date(),
            note: req.body.reason || 'Cancelled by user'
        })
        await order.save()
        return res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllOrders = async(req, res) => {
    try{
        const orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.product', 'name')
        .sort('-createdAt')

    const totalRevenue = orders.reduce((sum, order) =>{
        return order.status !== 'cancelled' ? sum + order.totalPrice : sum
    },0)
    return res.status(200).json({
        success: true,
        count: orders.length,
        totalRevenue,
        orders
    })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getSellerOrders = async(req, res) => {
    try{ 
        const orders = await Order.find({
            'items.seller': req.user._id
        })
        .populate('user', 'name email phone')
        .populate('items.product', 'name images')
        .sort('-createdAt')

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        })
    } catch(error) {
        return res.status(500).json({
            status: error.message
        })
    }
}