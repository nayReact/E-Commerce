import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items:[{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
    ],
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type:String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pin: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true
        }
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending','success','failed'],
        default: 'pending'
    },
    paymentDetails: {
        razorpay_order_id: String,
        razorpay_payment_id: String,
        razorpay_signature: String
    }, 
    itemsPrice: {
        type: Number,
        required: true,
        default: 0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['placed','processing','shipped','delivered','cancelled'],
        default: 'placed'
    },
    statusHistory: [
        {
            status: String,
            date: {
                type: Date,
                default: Date.now
            },
            note: String
        }
    ],
    trackingNumber: String,
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String
}, {timestamps: true}
)

orderSchema.pre('validate', function() {
  if (this.isNew) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;

    if (!this.statusHistory || this.statusHistory.length === 0) {
      this.statusHistory = [
        {
          status: 'placed',
          date: new Date(),
          note: 'Order placed successfully'
        }
      ];
    }
  }
});
export default mongoose.model('Order', orderSchema)