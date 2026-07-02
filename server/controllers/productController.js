import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';

// @desc    Get all products (with search/filters)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { search, category, brand, maxPrice, rating, sort } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    let sortQuery = {};
    if (sort === 'Price: Low to High') {
      sortQuery.price = 1;
    } else if (sort === 'Price: High to Low') {
      sortQuery.price = -1;
    } else if (sort === 'Rating') {
      sortQuery.rating = -1;
    } else {
      // Popularity
      sortQuery.createdAt = -1;
    }

    const products = await Product.find(query).sort(sortQuery);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// @desc    Get product details
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { name, description, price, originalPrice, discountPrice, category, brand, images, stock, specifications } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      originalPrice: originalPrice || price,
      discountPrice: discountPrice || 0,
      category,
      brand,
      images,
      stock: stock || 0,
      rating: 5.0, // default rating
      reviews: [],
      specifications: specifications || [],
    });

    const createdProduct = await product.save();
    
    // Increment productCount in corresponding Category model if it exists
    await Category.updateOne({ name: category }, { $inc: { productCount: 1 } });

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// @desc    Get all brands
// @route   GET /api/products/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};
