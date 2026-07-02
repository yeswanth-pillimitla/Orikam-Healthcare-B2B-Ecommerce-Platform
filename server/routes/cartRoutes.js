import express from 'express';
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // all cart routes are protected

router.route('/').get(getCart);
router.post('/add', addToCart);
router.put('/update', updateCartQuantity);
router.delete('/remove/:id', removeFromCart);

export default router;
