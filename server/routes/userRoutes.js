import express from 'express';
import { 
  updateUserProfile,
  getAllUsers,
  updateUserRole
} from '../controllers/userController.js';
import { protect, admin, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/update', protect, updateUserProfile);
router.get('/all', protect, admin, getAllUsers); // Admin-only: list all users
router.put('/:id/role', protect, superAdmin, updateUserRole); // Super Admin-only: change user roles

export default router;
