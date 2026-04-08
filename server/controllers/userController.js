import User from "../models/User.js";

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
        res.status(500).json({success: false, message: error.message})
    }
}