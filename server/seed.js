import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Brand from './models/Brand.js';
import Cart from './models/Cart.js';
import Wishlist from './models/Wishlist.js';
import Notification from './models/Notification.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // 1. Clear database collections
    console.log('Clearing old collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Notification.deleteMany();

    console.log('Old collections cleared.');

    // 2. Create default categories
    console.log('Seeding categories...');
    const categories = [
      { name: "Dental Chair", image: "/assets/category_chair.png", productCount: 10 },
      { name: "Composite", image: "/assets/category_composite.png", productCount: 10 },
      { name: "Handpieces", image: "/assets/category_handpiece.png", productCount: 10 },
      { name: "Endodontics", image: "/assets/category_endomotor.png", productCount: 10 },
      { name: "Imaging", image: "/assets/category_diagnostics.png", productCount: 10 },
      { name: "Surgical", image: "/assets/category_suture.png", productCount: 10 },
      { name: "Orthodontics", image: "/assets/category_brackets.png", productCount: 10 },
      { name: "X-Ray", image: "/assets/category_diagnostics.png", productCount: 10 },
      { name: "Polishers", image: "/assets/category_scaler.png", productCount: 10 },
      { name: "Diagnostics", image: "/assets/category_diagnostics.png", productCount: 10 },
    ];
    await Category.insertMany(categories);

    // 3. Create default brands
    console.log('Seeding brands...');
    const brands = [
      { name: "Waldent", logo: "Waldent" },
      { name: "MANI", logo: "MANI" },
      { name: "Super Endo", logo: "Super Endo" },
      { name: "Dentsply", logo: "Dentsply" },
      { name: "Endoking", logo: "Endoking" },
      { name: "NSK", logo: "NSK" },
      { name: "Woodpecker", logo: "Woodpecker" },
      { name: "3M ESPE", logo: "3M ESPE" },
      { name: "Ortho", logo: "Ortho" },
      { name: "avdec", logo: "avdec" }
    ];
    await Brand.insertMany(brands);

    // 4. Create products dynamically (10 items per brand and category, total 100 products)
    console.log('Seeding products dynamically...');
    const categoriesList = categories.map(c => c.name);
    const brandsList = brands.map(b => b.name);
    const products = [];
    const categoryImages = {
      "Dental Chair": "/assets/category_chair.png",
      "Composite": "/assets/category_composite.png",
      "Handpieces": "/assets/category_handpiece.png",
      "Endodontics": "/assets/category_endomotor.png",
      "Imaging": "/assets/category_diagnostics.png",
      "Surgical": "/assets/suction_prod.png",
      "Orthodontics": "/assets/category_brackets.png",
      "X-Ray": "/assets/category_diagnostics.png",
      "Polishers": "/assets/category_scaler.png",
      "Diagnostics": "/assets/category_diagnostics.png"
    };

    for (let b = 0; b < 10; b++) {
      const brandName = brandsList[b];
      for (let k = 0; k < 10; k++) {
        const catIdx = (b + k) % 10;
        const categoryName = categoriesList[catIdx];
        
        let price = 500;
        if (categoryName === "Dental Chair") price = 120000 + k * 8000;
        else if (categoryName === "Imaging") price = 85000 + k * 5000;
        else if (categoryName === "X-Ray") price = 95000 + k * 6000;
        else if (categoryName === "Endodontics") price = 15000 + k * 1200;
        else if (categoryName === "Surgical") price = 8000 + k * 700;
        else if (categoryName === "Handpieces") price = 6000 + k * 500;
        else if (categoryName === "Orthodontics") price = 2500 + k * 200;
        else if (categoryName === "Diagnostics") price = 1200 + k * 100;
        else if (categoryName === "Polishers") price = 1800 + k * 150;
        else if (categoryName === "Composite") price = 600 + k * 50;

        const originalPrice = Math.round(price * 1.2);
        const discountPrice = price;

        products.push({
          name: `${brandName} Premium ${categoryName} Series-${k + 1}`,
          brand: brandName,
          category: categoryName,
          price: price,
          originalPrice: originalPrice,
          discountPrice: discountPrice,
          images: [categoryImages[categoryName]],
          rating: Number((4.0 + ((b * k) % 11) / 10).toFixed(1)),
          stock: 10 + ((b * k) % 40),
          description: `The ${brandName} Premium ${categoryName} Series-${k + 1} represents the pinnacle of dental technology, offering superior reliability, ergonomic design, and clinical efficiency for modern dental practices.`,
          specifications: [
            { label: "Model Code", value: `${brandName.slice(0,3).toUpperCase()}-${categoryName.slice(0,3).toUpperCase()}-${k+100}` },
            { label: "Warranty", value: "1 Year Manufacturer Warranty" },
            { label: "Certification", value: "CE / ISO Certified" }
          ],
          reviews: []
        });
      }
    }

    await Product.insertMany(products);
    console.log('Products seeded.');

    // 5. Create default Admin User (Olivia Rhye)
    console.log('Seeding default Admin User...');
    const adminUser = await User.create({
      name: "Olivia Rhye",
      email: "olivia@orikam.com",
      phone: "+91 98765 43210",
      password: "password123", // Will be hashed automatically by user pre-save hook
      profileImage: "/assets/avatar_olivia.png",
      role: "Super Admin",
      clinicName: "Rhye Dental Clinic & Diagnostics",
      gstin: "36AAAAA1111A1Z1"
    });

    // Initialize clean cart and wishlist for admin
    await Cart.create({ user: adminUser._id, items: [] });
    await Wishlist.create({ user: adminUser._id, products: [] });

    // Seed mock notifications for Admin User
    const notifications = [
      {
        user: adminUser._id,
        type: "order",
        title: "Order Delivered Successfully",
        message: "Your surgical supplies order (ORD-724391) has been safely delivered to Banjara Hills, Hyderabad.",
        read: false
      },
      {
        user: adminUser._id,
        type: "offer",
        title: "Exclusive Bulk Autoclave Deal",
        message: "Super Admin Flash Discount! Get flat ₹5,000 off on Waldent Class B sterilizers using promo code STERILE5K.",
        read: false
      },
      {
        user: adminUser._id,
        type: "account",
        title: "New Address Added",
        message: "Orikam Clinic Noida branch address has been added to your profile card destination settings.",
        read: true
      }
    ];
    await Notification.insertMany(notifications);
    console.log('Admin user and notifications seeded.');

    console.log('\nDatabase seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
