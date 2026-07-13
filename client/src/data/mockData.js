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
  { name: "Diagnostics", image: "/assets/category_diagnostics.png", productCount: 10 }
];

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

// Generate products dynamically (10 items per brand and category, total 100 products)
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
      _id: `mock-prod-${b}-${k}`,
      id: `mock-prod-${b}-${k}`,
      name: `${brandName} Premium ${categoryName} Series-${k + 1}`,
      brand: brandName,
      category: categoryName,
      price: price,
      originalPrice: originalPrice,
      discountPrice: discountPrice,
      images: [categoryImages[categoryName]],
      image: categoryImages[categoryName],
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

export const mockCategories = categories;
export const mockBrands = brands;
export const mockProducts = products;
