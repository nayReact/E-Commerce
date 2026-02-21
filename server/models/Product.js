import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: 200
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxLength: 2000
    },
    price: {
        type: Number,
        required: [true, 'Product price is requred'],
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    finalPrice: {
        type: Number
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required: [true, 'Category is required']
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    brand: {
        type: String,
        trim: true
    },
    image:{
        type: [
            {
                url: String,
                public_id: String
            }
        ], default: []
    },
    specifications: {
        type: Map,
        of: String
    },
    stock: {
        type:Number,
        required: [true, 'Stock quantity is required'],
        min: 0,
        default: 0
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'active','inactive'],
        default: 'active'
    },
    views: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
},  {timestamps: true} )

productSchema.pre('save', function() {
    if(this.isModified('price') || this.isModified('discount')) {
        this.finalPrice = this.price - (this.price * this.discount /100)
    }
})

productSchema.index({
    name: 'text',
    description: 'text'
})

export default mongoose.model('Product', productSchema) 