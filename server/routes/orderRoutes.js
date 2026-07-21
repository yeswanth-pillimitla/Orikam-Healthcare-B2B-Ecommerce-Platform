import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/create', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/all', admin, getAllOrders); // Map all orders
router.put('/:id/status', admin, updateOrderStatus); // Map status update
router.get('/:id', getOrderById);

export default router;
