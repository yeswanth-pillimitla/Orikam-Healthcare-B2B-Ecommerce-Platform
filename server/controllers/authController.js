import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Address from '../models/Address.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, phone, password, profileImage, role, clinicName, gstin } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      profileImage: profileImage || '',
      role: role || 'Customer',
      clinicName: clinicName || '',
      gstin: gstin || '',
    });

    if (user) {
      // Initialize an empty Cart and Wishlist for this user
      await Cart.create({ user: user._id, items: [] });
      await Wishlist.create({ user: user._id, products: [] });

      // Add a welcome notification
      await Notification.create({
        user: user._id,
        type: 'account',
        title: 'Welcome to Orikam B2B!',
        message: `Hello ${user.name}, your professional clinic profile has been created successfully.`,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        clinicName: user.clinicName,
        gstin: user.gstin,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        clinicName: user.clinicName,
        gstin: user.gstin,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login server error' });
  }
};

// @desc    Get user profile (All nested dashboard details)
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Gather additional resources to sync with client state on reload
      const [addresses, payments, notifications, wishlistDoc, cartDoc] = await Promise.all([
        Address.find({ user: user._id }),
        Payment.find({ user: user._id }),
        Notification.find({ user: user._id }).sort({ createdAt: -1 }),
        Wishlist.findOne({ user: user._id }).populate('products'),
        Cart.findOne({ user: user._id }).populate('items.product'),
      ]);

      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          clinicName: user.clinicName,
          gstin: user.gstin,
          profileImage: user.profileImage,
        },
        addresses: addresses || [],
        paymentMethods: payments || [],
        notifications: notifications || [],
        wishlist: wishlistDoc ? wishlistDoc.products.map(p => p._id.toString()) : [],
        cart: cartDoc ? cartDoc.items : [],
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Profile server error' });
  }
};
