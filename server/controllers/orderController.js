import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Notification from '../models/Notification.js';

// @desc    Create new order
// @route   POST /api/orders/create
// @access  Private
export const createOrder = async (req, res) => {
  const {
    products,
    shippingAddress,
    paymentMethod,
    paymentDetails,
    subtotal,
    discount,
    delivery,
    tax,
    totalAmount,
  } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ error: 'No order items' });
  }

  try {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = new Order({
      user: req.user._id,
      orderId,
      products,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      subtotal,
      discount,
      delivery,
      tax,
      totalAmount,
      orderStatus: 'Ordered',
      paymentStatus: 'Paid',
    });

    const createdOrder = await order.save();

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Create success notification
    await Notification.create({
      user: req.user._id,
      type: 'order',
      title: 'Order Placed Successfully',
      message: `Your medical supplies request (${orderId}) totaling ₹${totalAmount.toLocaleString('en-IN')} has been logged.`,
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch your orders' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order && (order.user._id.toString() === req.user._id.toString() || req.user.role === 'Admin' || req.user.role === 'Super Admin')) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email phone clinicName').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = status || order.orderStatus;
      const updatedOrder = await order.save();

      // Create a status update notification for the customer
      await Notification.create({
        user: order.user,
        type: 'order',
        title: `Order Status Updated: ${status}`,
        message: `Your medical supplies request (${order.orderId}) status has been updated to ${status}.`,
      });

      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
