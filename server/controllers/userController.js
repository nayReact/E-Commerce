import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getProfile = async(req, res) => {
       try{ 
            const user = await User.findById(req.user._id)
            return res.status(200).json({success: true, user})
        } catch(error) {
            return res.status(500).json({ success: false, message: error.message })
        }
}


export const updateProfile = async(req, res) => {
    try {
        const {name, phone, avatar} = req.body
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {name, phone, avatar},
        {retuenDocument: 'after', runValidators: true}
    )
    return res.status(200).json({ success: true, user})

    } catch(error) {
        return res.status(500).json({success: false, message: error.message })
    }
    
} 

export const addAddress = async(req, res) => {
    try {
        const {street, city, state, pin, country, isDefault } = req.body
        const user = await User.findById(req.user._id)

        if(isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false)
        }
        user.addresses.push({street, city, state, pin, country, isDefault})
        await user.save()
        return res.status(200).json({status: true, addresses: user.addresses })
    } catch(error) {
        return res.status(500).json({success: false, error: error.message})
    }
}

export const updateAddress = async(req, res) => {
    try {
        const {street, city, state, pin, country, isDefault} = req.body
        const user = User.findById(req.user._id)

        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === req.params.addressId
        )
        if(addressIndex === -1) {
            return res.status(404).json({success: false, message: 'Address not found'})
        }
        if(isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false)
        }

        const addr = user.addresses[addressIndex]
        addr.street = street
        addr.city = city
        addr.state = state
        addr.pin = pin
        addr.country = country || 'India'
        addr.isDefault = isDefault || false
        
        await user.save()
        return res.status(200).json({success: true, addresses: user.addresses})

    } catch(error) {
        return res.status(500).json({status: false, message: error.message})
    }
}

export const deleteAddress = async(req, res) => {
    try {
        const user = await User.findById(req.user._id)
        user.addresses = user.addresses.filter(
            addr => addr._id.toString() !== req.params.addressId
        )
        await user.save()
        return res.status(200).json({success: true, addresses: user.addresses})

    }catch(error) {
        return res.status(500).json({success: false, error: error.message})
    }
}

export const setDefaultAddress = async(req, res) => {
    try {
        const user = await User.findById(req.user._id)
        user.addresses.forEach(addr => {
            addr.isDefault = addr._id.toString() === req.params.addressId
        })
        await user.save()
        return res.status(200).json({success: true, addresses: user.addresses })

    } catch(error) {
        return res.status(500).json({success: false, message: error.message})
    }
}

export const changePassword = async(req, res) => {
    try {
        const {currentPassword, newPassword, confirmPassword } = req.body

        //to validate inputs
        if(!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false, 
                message: 'All fields are required'
            })
        }

        if(newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Password do not match'})
        }

        if( newPassword.length < 6) {
             return res.status(400).json({ success: false, message: 'New password must be atleast 6 characters'})
        }

        if(!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'Password must be 8+ chars, include 1 uppercase & 1 number'})
        }

        //get the user with password
        const user = await User.findById(req.user._id).select('+password')

        //to verify curr pass
        const isMatch = await user.comparePassword(currentPassword)
        if(!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect'})
        }

        //update pass-pre save hook will hash it
        user.password = newPassword
        await user.save()

        return res.status(200).json({ success: true, message: 'Password chaged successfully '})

    } catch(error) {
        return res.status(500).json({success: false, message: error.message})
    }
}