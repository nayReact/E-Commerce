import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxLength: 50
    },
    slug:{
        type:String,
        unique: true,
        lowercase: true
    },
    description:{
        type:String,
        maxLength: 200
    },
    image:{
        type: String,
        default: 'https://placehold.co/300x200/e3e3e3/666666?text=Category'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isActive:{
        type: Boolean,
        default: true
    }
},{timestamps: true}
)

categorySchema.pre('save', function(){  //this function will generate auto slug from name
    if(this.isModified('name')) {
        this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

        if(!this .image || this.image.includes('placeholder.co')) {
            const encodedName = encodeURIComponent(this.name)
            this.image = `https://placehold.co/300x200/4f46e5/ffffff?text=${encodedName}`
        }
    }
})

export default mongoose.model('Category', categorySchema)