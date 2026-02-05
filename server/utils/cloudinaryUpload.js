import cloudinary from "../config/cloudinary.js";
import { Readable } from 'stream'

export const uploadToCloudinary = (fileBuffer, folder = 'ecommerce') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
                transformation : [
                    {width: 800, height: 800, crop: 'limit'}, //for dimension
                    {quality: 'auto'} //to optimize quality automatically
                ]
            },
            (error, result) => {
                if(error) {
                    reject(error)
                } else {
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id
                    })
                }
            }
        )

        const readableStream = new Readable()  //to convert buffer to stream and pipe to cloudinary
        readableStream.push(fileBuffer)
        readableStream.push(null)
        readableStream.pipe(uploadStream)
    })   
}

export const deleteFromCloudinary = async(publicId) => {
    try{
        const result = await cloudinary.uploader.destroy(publicId)
        return result
    } catch(error) {
        console.error('Cloudinary delete error:', error)
        throw error
    }
}

export const uploadMultipleToCloudinary = async(files, folder = 'ecommerce') => {
    const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, folder))
    return await Promise.all(uploadPromises)
}