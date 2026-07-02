import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  getCategories,
  getBrands,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/:id', getProductById);

export default router;
