import multer from "multer";

const storage = multer.memoryStorage()  //file stored as buffer/RAM

const fileFilter =(req, file, cb) => { //filefilter to allow only image
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type. Only JPEG,JPG, PNG and WEBP allowed'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5*1024*1024
    }
})

export const uploadSingle = upload.single('image')
export const uploadMultiple = upload.array('images', 5)

export default upload 