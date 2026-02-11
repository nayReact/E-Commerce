import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price finalPrice images stock status isActive'
      });

    if (!cart) {
      // Create cart if doesn't exist
      cart = new Cart({ 
        user: req.user._id, 
        items: [] 
      });
      await cart.save();
      
      // Populate after creation
      cart = await Cart.findById(cart._id)
        .populate({
          path: 'items.product',
          select: 'name price finalPrice images stock status isActive'
        });
    }

    return res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {
    console.error('Get Cart Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists and is active
    const product = await Product.findById(productId);

    if (!product || !product.isActive || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });

   if (!cart) {
  cart = new Cart({ 
    user: req.user._id, 
    items: [] 
  });
}

    // Safety check: ensure items array exists
    if (!cart.items || !Array.isArray(cart.items)) {
      cart.items = [];
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      // Check stock for new quantity
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.finalPrice;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.finalPrice
      });
    }

    await cart.save();

    // Populate and return
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price finalPrice images stock'
    });

    return res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart
    });

  } catch (error) {
    console.error('Add to Cart Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCartItem = async(req, res) => {
    try{ 
        const {quantity} = req.body
        const {itemId} = req.params

        if(quantity <1) {
            return res.status(400).json({
                success: false,
                message: 'quantity must be at least 1'
            })
        }

        const cart = await Cart.findOne({user: req.user._id})
        if(!cart) {
            return res.status(404).json({
                success: false,
                messagae: 'Cart not found'
            })
        }

        const itemIndex = cart.items.findIndex(
            item => item.item._id.toString() === itemId
        )
        if(itemIndex === -1){
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            })
        }
        //to check stock
        const product = await Product.findById(cart.items[itemIndex].product)

        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        if(product.stock < quantity){
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available`
            })
        }

        cart.items[itemIndex].quantity = quantity
        cart.items[itemIndex].price = product.finalPrice 

        await cart.save()

        const updatedCart = await Cart.findById(cart._id).populate({
            path: 'items.product',
            select: 'name price finalPrice images stock'
        })
        return res.status(200).json({
            success: true,
            message: "cart updated",
            cart: updatedCart
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const removeFromCart = async(req, res) => {
    try{
        const {itemId} = req.params

        const cart = await Cart.findOne({ user: req.user._id })

        if(!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            })
        }

        cart.items = cart.items.filter(
            item => item._id.toString() !== itemId
        )
        await cart.save()

        const updatedCart = await Cart.findById(cart._id).populate({
            path: 'items.product',
            select: 'name price finalPrice images stock'
        })
        return res.status(200).json({
            success: true,
            message: 'Item removes from cart',
            cart: updatedCart
        })

    } catch(error) {
        return res.status(500).json({
            success: false  ,
            message: error.message
        })
    }
}

export const clearCart = async( req, res) => {
    try {
        const cart = await Cart.findOne({user: req.user._id})

        if(!cart) {
            return res.status(404).json({
                succes: false,
                message: 'Cart not found'
            })
        }
        cart.items = []
        await cart.save()
        
        return res.status(200).json({
            success: true,
            message: 'Cart cleared',
            cart
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}