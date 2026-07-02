import express from 'express';
import Payment from '../models/Payment.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// @desc    Get user payment methods
// @route   GET /api/payment
// @access  Private
router.get('/', async (req, res) => {
  try {
    const paymentMethods = await Payment.find({ user: req.user._id });
    res.json(paymentMethods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// @desc    Add new payment method
// @route   POST /api/payment
// @access  Private
router.post('/', async (req, res) => {
  const { type, cardType, last4, cardHolder, expiry, handle, bankName, accountNumber, isDefault } = req.body;

  try {
    const count = await Payment.countDocuments({ user: req.user._id });
    const makeDefault = count === 0 ? true : isDefault;

    if (makeDefault) {
      await Payment.updateMany({ user: req.user._id }, { isDefault: false });
    }

    await Payment.create({
      user: req.user._id,
      type,
      cardType,
      last4,
      cardHolder,
      expiry,
      handle,
      bankName,
      accountNumber,
      isDefault: makeDefault,
    });

    const paymentMethods = await Payment.find({ user: req.user._id });
    res.status(201).json(paymentMethods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add payment method' });
  }
});

// @desc    Delete payment method
// @route   DELETE /api/payment/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, user: req.user._id });

    if (!payment) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    const wasDefault = payment.isDefault;
    await payment.deleteOne();

    if (wasDefault) {
      const remainingPayment = await Payment.findOne({ user: req.user._id });
      if (remainingPayment) {
        remainingPayment.isDefault = true;
        await remainingPayment.save();
      }
    }

    const paymentMethods = await Payment.find({ user: req.user._id });
    res.json(paymentMethods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete payment method' });
  }
});

// @desc    Set default payment method
// @route   PUT /api/payment/:id/default
// @access  Private
router.put('/:id/default', async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, user: req.user._id });

    if (payment) {
      await Payment.updateMany({ user: req.user._id }, { isDefault: false });
      payment.isDefault = true;
      await payment.save();

      const paymentMethods = await Payment.find({ user: req.user._id });
      res.json(paymentMethods);
    } else {
      res.status(404).json({ error: 'Payment method not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to set default payment method' });
  }
});

export default router;
