import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Provide your name'],
        trim: true,
        maxLength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email']
    },
    password: {
        type:String,
        required: [true, 'Provide a password!'],
        minLength: [6, 'Password must be atleast 6 characters'],
        select: false,  //dont return pass in queries
    },
    phone: {
        type:String,
        required: [true, ' Please provide your phone number'],
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    role: {
        type: String,
        enum: ['customer','seller','admin'],
        default: 'customer'
    },
    avatar:{
        type:String,
        default: 'https://ui-avatars.com/api/?name=User&background=random&size=150'
    },
    isApproved: { //for seller- need admin aprovl
        type:Boolean,
        default: true
        
    },
    addresses: [{  //could be multiple ship addrs
        street: String,
        city: String,
        state: String,
        pin: String,
        country: { type: String, default: 'India'},
        isDefault: Boolean
    }],
    isActive: {
        type: Boolean,
        default: true
    },
},
{
    timestamps: true
})

userSchema.pre('save', async function() {
    if(!this.isModified('password')) {
        return
    }
    console.log('hashing pass')
    this.password = await bcrypt.hash(this.password, 10)
    console.log('password hashed')
    // const salt = await bcrypt.genSalt(10)
    // this.password = await bcrypt.hash(this.password, salt)  
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

// userSchema.methods.getPublicProfile = function() {
//     return {
//         _id: this._id,
//         name: this.name,
//         email: this.email,
//         phone: this.phone,
//         role: this.role,
//         avatar: this.avatar,
//         isApproved: this.isApproved,
//         addresses: this.addresses,
//         createdAt: this.createdAt
//     }
// }

export default mongoose.model('User', userSchema)