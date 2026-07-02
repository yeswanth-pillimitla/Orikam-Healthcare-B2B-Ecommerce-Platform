import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  comment: { type: String, required: true }
});

const specificationSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [reviewSchema],
    specifications: [specificationSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual('image').get(function() {
  return this.images && this.images.length > 0 ? this.images[0] : '';
});

productSchema.virtual('discount').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    const pct = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    return `${pct}% OFF`;
  }
  return '';
});

const Product = mongoose.model('Product', productSchema);
export default Product;
