import express from 'express';
import Address from '../models/Address.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// @desc    Get user addresses
// @route   GET /api/address
// @access  Private
router.get('/', async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// @desc    Add new address
// @route   POST /api/address
// @access  Private
router.post('/', async (req, res) => {
  const { name, phone, addressLine, city, pincode, isDefault } = req.body;

  try {
    const addressCount = await Address.countDocuments({ user: req.user._id });
    
    // If it's the first address, make it default automatically
    const makeDefault = addressCount === 0 ? true : isDefault;

    if (makeDefault) {
      // Set all other user addresses to not default
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user._id,
      name,
      phone,
      addressLine,
      city,
      pincode,
      isDefault: makeDefault,
    });

    const addresses = await Address.find({ user: req.user._id });
    res.status(201).json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create address' });
  }
});

// @desc    Update address
// @route   PUT /api/address/:id
// @access  Private
router.put('/:id', async (req, res) => {
  const { name, phone, addressLine, city, pincode, isDefault } = req.body;

  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (address) {
      address.name = name || address.name;
      address.phone = phone || address.phone;
      address.addressLine = addressLine || address.addressLine;
      address.city = city || address.city;
      address.pincode = pincode || address.pincode;

      if (isDefault) {
        await Address.updateMany({ user: req.user._id }, { isDefault: false });
        address.isDefault = true;
      }

      await address.save();
      const addresses = await Address.find({ user: req.user._id });
      res.json(addresses);
    } else {
      res.status(404).json({ error: 'Address not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// @desc    Delete address
// @route   DELETE /api/address/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const wasDefault = address.isDefault;
    await address.deleteOne();

    if (wasDefault) {
      // Find another address and make it default
      const remainingAddress = await Address.findOne({ user: req.user._id });
      if (remainingAddress) {
        remainingAddress.isDefault = true;
        await remainingAddress.save();
      }
    }

    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// @desc    Set default address
// @route   PUT /api/address/:id/default
// @access  Private
router.put('/:id/default', async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (address) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
      address.isDefault = true;
      await address.save();

      const addresses = await Address.find({ user: req.user._id });
      res.json(addresses);
    } else {
      res.status(404).json({ error: 'Address not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to set default address' });
  }
});

export default router;
