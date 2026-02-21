import Category from "../models/Category.js";

export const createCategory = async(req, res) => {
    const {name, description, image, parent} = req.body
    try{
        const existingCategory = await Category.findOne({name})
        if(existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            })
        }
        const category = await Category.create({
            name,
            description,
            image,
            parent: parent || null
        })
        return res.status(200).json({
            success: true,
            message: 'Category created successfully',
            category
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getCategories = async(req, res) => {
    try{ 
        const categories = await Category.find({ isActive: true})
        .populate('parent', 'name slug')
        .sort({ name: 1})

        return res.status(200).json({
            success: true,
            count: categories.length,
            categories
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export  const getCategory = async(req, res) => {
    try{
        const category = await Category.findById(req.params.id)
        .populate('parent', 'name slug')
        if(!category) {
            return res.status(404).json({
                success: false,
                messgae: 'Category Not Found'
            })
        }
        return res.status(200).json({
            success: true,
            category
        })

    }catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateCategory = async(req, res) => {
    try{ 
        const category = await Category.findById(req.params.id)
        if(!category) {
            return res.status(404).json({
                success:false,
                message: 'Category not found'
            })
        }
        const {name, description, image, parent, isActive} = re.body
        const updates = {name, description, image, parent, isActive }
        Object.keys(updates).forEach(key => {
            if(updates[key] !== undefined) {
                category[key] = updates[key]
            }
        })
        await category.save()

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteCategory = async(req, res) => {
    try{
        const category = await Category.findByIdAndDelete(req.params.id, {isActive: false}, {new:true})
        if(!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        })
    }catch(error){
        return res.status(500).json({
      success: false,
      message: error.message
    })
    }
}