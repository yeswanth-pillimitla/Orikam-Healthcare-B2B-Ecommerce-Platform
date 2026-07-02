import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart.items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity) || 1;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Item already in cart, increment quantity
      cart.items[itemIndex].quantity += qty;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    
    // Return the updated, populated cart items
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.status(200).json(updatedCart.items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
export const updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body; // absolute quantity

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      if (Number(quantity) <= 0) {
        // Remove item if quantity is zero or less
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }
      await cart.save();
      
      const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      res.json(updatedCart.items);
    } else {
      res.status(404).json({ error: 'Item not found in cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart quantity' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:id
// @access  Private
export const removeFromCart = async (req, res) => {
  const productId = req.params.id;

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(updatedCart.items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};
