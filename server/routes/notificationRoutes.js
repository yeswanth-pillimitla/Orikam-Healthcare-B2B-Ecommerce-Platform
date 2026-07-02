import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', async (req, res) => {
  try {
    const notif = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (notif) {
      notif.read = true;
      await notif.save();
      const list = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.json(list);
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    const list = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update all notifications' });
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const notif = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (notif) {
      await notif.deleteOne();
      const list = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.json(list);
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;
