import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json(wishlist.products.map(p => p._id.toString()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// @desc    Toggle wishlist item (add or remove)
// @route   POST /api/wishlist/toggle
// @access  Private
router.post('/toggle', async (req, res) => {
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const exists = wishlist.products.includes(productId);

    if (exists) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    res.json(wishlist.products.map(id => id.toString()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to toggle wishlist' });
  }
});

export default router;
