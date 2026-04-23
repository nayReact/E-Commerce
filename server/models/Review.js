import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true,
        maxLength: 100
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true,
        maxLength: 1000
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true })

// Auto update product rating after save
reviewSchema.statics.updateProductRating = async function(productId) {
    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ])

    if(stats.length > 0) {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            numReviews: stats[0].numReviews
        })
    } else {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            rating: 0,
            numReviews: 0
        })
    }
}

reviewSchema.post('save', function() {
    this.constructor.updateProductRating(this.product)
})

reviewSchema.post('findOneAndDelete', function(doc) {
    if(doc) {
        doc.constructor.updateProductRating(doc.product)
    }
})

export default mongoose.model('Review', reviewSchema)