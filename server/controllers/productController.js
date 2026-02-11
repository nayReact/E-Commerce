import Product from '../models/Product.js'
import { uploadMultipleToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js'

const parseSpecs = (specs) => {  //to perse specification
    return typeof specs === 'string' ? JSON.parse(specs) : specs
}

const deleteProductImage = async(images) => { //to delete product image
    const deletePromises = images.filter(img => img.public_id).map(img => deleteFromCloudinary(img.public_id))

    await Promise.all(deletePromises)
}

const checkOwnership = (product, user) => {  //to check product ownership
    if(user.role === 'admin'){
        return true
    }
    return product.seller.toString() === user._id.toString()
}

export const createProduct = async(req, res) => {
    try{
        const {specifications, ...productData } =req.body

        const image = req.files?.length
            ? await uploadMultipleToCloudinary(req.files, 'products'):[]

            const product = await Product.create({
                ...productData,
                specifications: specifications ? parseSpecs(specifications) : undefined,
                image,
                seller: req.user._id,
                discount: productData.discount || 0,
                subcategory: productData.subcategory || null
            })
            return res.status(201).json({
                success: true,
                message: 'Product created Successfully',
                product
            })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

export const getProducts = async(req, res) => {     //to get all theproducts
    try{
        const { page=1, limit=20, search, category, minPrice, maxPrice, sort ='-createdAt'} = req.query
        const query = {
            isActive: true,
            status: 'active'
        }
        if(search){
            query.$text = {$search: search}
        }
        if(category){
            query.category = category
        }
        if (minPrice || maxPrice) {
            query.finalPrice = {
                ...(minPrice && { $gte: Number(minPrice) }),
                ...(maxPrice && { $lte: Number(maxPrice) })
            };
        }

        const skip = (page - 1)*limit
        
        const [products, total] = await Promise.all([
            Product.find(query)
                .populate("category", "name slug")
                .populate("subcategory", "name slug")
                .populate("seller", "name email")
                .sort(sort)
                .limit(Number(limit))
                .skip(skip),
            Product.countDocuments(query)
        ])
        return res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: Number(page),
            pages: Math.ceil(total/limit),
            products
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

export const getProduct = async(req, res) => { //get single product
    try{
        const product = await Product.findByIdAndUpdate(req.params.id,
            {$inc: {views: 1}},
            { new: true }
        )
        .populate("category","name slug")
        .populate("subcategory"," name slug")
        .populate("seller", "name email avatar")

        if(!product) {
            return res.status(400).json({
                success:false,
                message:"Product not found"
            })
        }
        res.status(200).json({
            success:true,
            product
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateProduct = async(req, res) => { //update product
    try{
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({
                success:false,
                message: "product not found"
            })
        }
        if(!checkOwnership(product, req.user)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product '
            })
        }
        const {specification, ...otherUpdates } =req.body
        const updates = {
            ...otherUpdates,
            ...(specifications && { specifications: parseSpecs(specifications)})
        }

        if(req.files?.length) {
            await deleteProductImage(product.images)
            updates.images = await uploadMultipleToCloudinary(req.files, 'products')
        }

        const updatedProduct = await Product.findByIdAndUpdate( req.params.id, updates, {new: true, runValidators: true})
        return res.status(200).json({
            success: true,
            messgae: 'Product updates successfully',
            product: updatedProduct
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteProduct = async(req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }
        if(!checkOwnership(product, req.user)) {   
            return res.status(403).json({
                success: false,
                messasge: 'Not authorized to delete'
            })
        }

        await Promise.all([     //delete image and product softdelete
            deleteProductImage(product.images),
            Product.findByIdAndUpdate(req.params.id, {isActive: false})
        ])
        return res.status(200).json({
            success: true,
            message: 'product deleted successfully'
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getSellerProducts = async(req, res) => {
    try{
        const products = await Product.find({
            seller: req.user._id,
            isActive: true
        })
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .sort('-createdAt');

        return res.status(200).json({
        success: true,
        count: products.length,
        products
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
