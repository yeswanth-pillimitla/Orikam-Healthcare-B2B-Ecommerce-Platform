import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    products: [orderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentDetails: {
      type: String,
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    delivery: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      default: 'Ordered',
      enum: ['Ordered', 'Packed', 'Shipped', 'Delivered'],
    },
    paymentStatus: {
      type: String,
      required: true,
      default: 'Paid', // Assuming success on mock submit, or 'Pending'
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
