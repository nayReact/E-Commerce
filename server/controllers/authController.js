import SendmailTransport from 'nodemailer/lib/sendmail-transport/index.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { otpEmailTemplate } from '../utils/emailTemplates.js';
//import {sendEmail} from '../config/nodemailer.js'
import { sentEmail } from '../config/nodemailer.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random()* 900000).toString()
}

export const register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'customer',
      isApproved: role === 'seller' ? false : true
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    if (user.role === 'seller' && !user.isApproved) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account pending approval' 
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        avatar: req.user.avatar
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const sendOTP = async(req, res) => {
  try{
    const {email} = req.body

    if(!email) {
      return res.status(400).json({ success: false, message: 'Email is required '})
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: " NO account found with this email! Register first"})
    }

  

    // if(!user.isActive) {
    //   return res.status(403).json({ success: false, message: ' Account is deactivated'})
    // }

    //check if otp was sent recently
    if(user.otp?.expiresAt && user.otp.expiresAt > new Date(Date.now() - 60000)) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 60 seconds before requesting another otp'
      })
    }

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 *60 *1000) // 10 minutes 

    user.otp = {code: otp, expiresAt, attempts: 0 }
    await user.save()

    // to send Mail

    await sentEmail({
      to: user.email,
      subject: `${otp} is your ShopHub login OTP`,
      html: otpEmailTemplate(otp, user.name)
    })
    return res.status(200).json( {success: true, message: `OTP sent to ${email}`})
  } catch(error) {
      console.error('Send otp error: ', error)
      return res.status(500).json({ success: false, message: error.message})
  }
}

export const verifyOTP = async(req, res) => {
    try {
        const { email, otp } = req.body

        if(!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            })
        }

        const user = await User.findOne({ email })
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // Check OTP exists
        if(!user.otp?.code) {
            return res.status(400).json({
                success: false,
                message: 'No OTP requested. Please request a new OTP'
            })
        }

        // Check expiry
        if(user.otp.expiresAt < new Date()) {
            user.otp = undefined
            await user.save()
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one'
            })
        }

        // Check max attempts (3)
        if(user.otp.attempts >= 3) {
            user.otp = undefined
            await user.save()
            return res.status(400).json({
                success: false,
                message: 'Too many attempts. Please request a new OTP'
            })
        }

        // Verify OTP
        if(user.otp.code !== otp) {
            user.otp.attempts += 1
            await user.save()
            const remaining = 3 - user.otp.attempts
            return res.status(400).json({
                success: false,
                message: `Incorrect OTP. ${remaining} attempts remaining`
            })
        }

        // OTP valid — check if account is active
        if(!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated'
            })
        }

        // Clear OTP
        user.otp = undefined
        await user.save()

        // Generate token
        const token = generateToken(user._id)

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        })
    } catch(error) {
        console.error('Verify OTP error:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        })
    }
}