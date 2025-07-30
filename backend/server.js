require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Environment-based configs
const MONGO_URI = process.env.MONGO_URI;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secure_secret_key_123';
const ADMIN_CREDS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123',
};

// Directory paths
const FRONTEND_ROOT = path.resolve(__dirname, '..', 'my-ecommerce-admin');
const UPLOADS_DIR = path.resolve(FRONTEND_ROOT, 'public', 'uploads');
const ASSETS_DIR = path.resolve(FRONTEND_ROOT, 'src', 'assets');
const ALL_PRODUCTS_FILE = path.join(ASSETS_DIR, 'all_products.js');

// Ensure folders exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
if (!fs.existsSync(ALL_PRODUCTS_FILE)) {
  fs.writeFileSync(ALL_PRODUCTS_FILE, `const products = [];
export default products;`);
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define order schema
const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  city: String,
  phone: String,
  whatsapp: String,
  cartProducts: [{
    id: String,
    name: String,
    quantity: Number,
    price: Number,
    new_price: Number,
    image: String,
    total: Number,
  }],
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model('Order', orderSchema);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  }
});

// CORS setup
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ["http://localhost:3000", "https://shaniking.site"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Helpers
const readProductsFromFile = filePath => {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/\[.*\]/s);
  return match ? JSON.parse(match[0]) : [];
};
const writeProductsToFile = (filePath, products) => {
  fs.writeFileSync(filePath, `const products = ${JSON.stringify(products, null, 2)};\nexport default products;`);
};
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Failed to authenticate token' });
    req.user = decoded;
    next();
  });
};

// Auth
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1d' });
    return res.json({ success: true, token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Products
app.get('/api/products/:category', (req, res) => {
  try {
    const categoryFile = path.join(ASSETS_DIR, `${req.params.category}.js`);
    const products = readProductsFromFile(categoryFile);
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
app.get('/api/products', (req, res) => {
  try {
    const products = readProductsFromFile(ALL_PRODUCTS_FILE);
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Failed to fetch all products' });
  }
});
app.delete('/api/products/:category/:id', verifyToken, (req, res) => {
  try {
    const { category, id } = req.params;
    const categoryFile = path.join(ASSETS_DIR, `${category}.js`);
    let products = readProductsFromFile(categoryFile);
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });

    const [deleted] = products.splice(productIndex, 1);
    writeProductsToFile(categoryFile, products);

    let allProducts = readProductsFromFile(ALL_PRODUCTS_FILE);
    allProducts = allProducts.filter(p => p.id !== id);
    writeProductsToFile(ALL_PRODUCTS_FILE, allProducts);

    if (deleted.image) {
      const imgPath = path.join(UPLOADS_DIR, path.basename(deleted.image));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    res.json({ success: true, message: 'Product deleted', deletedProduct: deleted });
  } catch {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});
app.put('/api/products/:category/:id', verifyToken, (req, res) => {
  try {
    const { category, id } = req.params;
    const { name, price, new_price } = req.body;
    const categoryFile = path.join(ASSETS_DIR, `${category}.js`);
    let products = readProductsFromFile(categoryFile);
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    products[idx] = {
      ...products[idx],
      name: name || products[idx].name,
      price: parseFloat(price || products[idx].price),
      new_price: parseFloat(new_price || products[idx].new_price),
      updatedAt: new Date().toISOString()
    };
    writeProductsToFile(categoryFile, products);

    let allProducts = readProductsFromFile(ALL_PRODUCTS_FILE);
    const allIdx = allProducts.findIndex(p => p.id === id);
    if (allIdx !== -1) {
      allProducts[allIdx] = { ...products[idx] };
      writeProductsToFile(ALL_PRODUCTS_FILE, allProducts);
    }

    res.json({ success: true, product: products[idx] });
  } catch {
    res.status(500).json({ error: 'Failed to update product' });
  }
});
app.post('/api/upload', verifyToken, upload.single('image'), (req, res) => {
  try {
    const { name, price, new_price, category } = req.body;
    if (!name || !price || !category || !req.file) throw new Error('Missing fields or file');

    const imageUrl = `/uploads/${req.file.filename}`;
    const product = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      new_price: parseFloat(new_price || price),
      image: imageUrl,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const categoryFile = path.join(ASSETS_DIR, `${category}.js`);
    let products = readProductsFromFile(categoryFile);
    products.push(product);
    writeProductsToFile(categoryFile, products);

    let allProducts = readProductsFromFile(ALL_PRODUCTS_FILE);
    allProducts.push(product);
    writeProductsToFile(ALL_PRODUCTS_FILE, allProducts);

    res.json({ success: true, product });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join(UPLOADS_DIR, req.file.filename));
    res.status(400).json({ error: error.message });
  }
});

// Orders
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, address, city, phone, whatsapp, cartProducts } = req.body;
    const updatedCart = cartProducts.map(p => ({
      ...p,
      total: (p.new_price || p.price) * p.quantity
    }));
    const newOrder = new Order({ name, email, address, city, phone, whatsapp, cartProducts: updatedCart });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/orders', async (req, res) => {
  try {
    const dbOrders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ dbOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Uploads directory: ${UPLOADS_DIR}`);
  console.log(`All products file: ${ALL_PRODUCTS_FILE}`);
});