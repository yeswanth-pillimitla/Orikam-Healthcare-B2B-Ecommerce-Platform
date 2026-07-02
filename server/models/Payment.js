import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String, // 'Card', 'UPI', 'Bank'
      required: true,
    },
    cardType: {
      type: String, // 'Visa', 'Mastercard'
    },
    last4: {
      type: String,
    },
    cardHolder: {
      type: String,
    },
    expiry: {
      type: String,
    },
    handle: {
      type: String, // UPI VPA
    },
    bankName: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
