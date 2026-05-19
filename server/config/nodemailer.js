import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sentEmail = async({ to, subject, html}) => {
    try{
        const info = await transporter.sendMail({
            to,
            subject,
            html
        })
        console.log('Email sent:', info.messageId)
        return info

    } catch(error) {
        console.error('Email error:', error)
        throw error
    }
}

export default transporter