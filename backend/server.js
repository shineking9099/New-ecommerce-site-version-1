require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration
const SECRET_KEY = process.env.SECRET_KEY || 'your_secure_secret_key_123';
const ADMIN_CREDS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

// Path configuration
const FRONTEND_ROOT = path.resolve(__dirname, '..', 'my-ecommerce-admin');
const UPLOADS_DIR = path.resolve(FRONTEND_ROOT, 'public', 'uploads');
const ASSETS_DIR = path.resolve(FRONTEND_ROOT, 'src', 'assets');

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

// Multer configuration
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

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    
    req.user = decoded;
    next();
  });
};

// Debug endpoint
app.get('/api/debug/uploads', (req, res) => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      uploadsDir: UPLOADS_DIR,
      files: files,
      absolutePath: path.resolve(UPLOADS_DIR)
    });
  });
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1d' });
    return res.json({ success: true, token });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

// Get products by category
app.get('/api/products/:category', (req, res) => {
  try {
    const category = req.params.category;
    const categoryFile = path.join(ASSETS_DIR, `${category}.js`);
    
    if (!fs.existsSync(categoryFile)) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const content = fs.readFileSync(categoryFile, 'utf8');
    const match = content.match(/\[.*\]/s);
    const products = match ? JSON.parse(match[0]) : [];
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Delete product
app.delete('/api/products/:category/:id', verifyToken, (req, res) => {
  try {
    const category = req.params.category;
    const id = req.params.id;
    const categoryFile = path.join(ASSETS_DIR, `${category}.js`);

    if (!fs.existsSync(categoryFile)) {
      return res.status(404).json({ error: 'Category file not found' });
    }

    const content = fs.readFileSync(categoryFile, 'utf8');
    const match = content.match(/\[.*\]/s);
    let products = match ? JSON.parse(match[0]) : [];

    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const [deletedProduct] = products.splice(productIndex, 1);
    fs.writeFileSync(categoryFile, `const products = ${JSON.stringify(products, null, 2)};\nexport default products;`);

    res.json({ success: true, message: 'Product deleted successfully', deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Update product
app.put('/api/products/:category/:id', verifyToken, (req, res) => {
  try {
    const { category, id } = req.params;
    const { name, price } = req.body;
    const categoryFile = path.join(ASSETS_DIR, `${category}.js`);
    
    if (!fs.existsSync(categoryFile)) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const content = fs.readFileSync(categoryFile, 'utf8');
    const match = content.match(/\[.*\]/s);
    let products = match ? JSON.parse(match[0]) : [];

    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product
    products[productIndex] = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      price: price ? parseFloat(price) : products[productIndex].price,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(categoryFile, `const products = ${JSON.stringify(products, null, 2)};\nexport default products;`);

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: products[productIndex]
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      error: 'Failed to update product',
      details: error.message 
    });
  }
});

// Upload product
app.post('/api/upload', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) throw new Error('No file uploaded');
    
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      fs.unlinkSync(path.join(UPLOADS_DIR, req.file.filename));
      throw new Error('Missing required fields');
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const categoryFile = path.join(ASSETS_DIR, `${category}.js`);
    
    let products = [];
    if (fs.existsSync(categoryFile)) {
      const content = fs.readFileSync(categoryFile, 'utf8');
      const match = content.match(/\[.*\]/s);
      products = match ? JSON.parse(match[0]) : [];
    }

    products.push({
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      image: imageUrl,
      category,
      createdAt: new Date().toISOString()
    });

    fs.writeFileSync(categoryFile, `const products = ${JSON.stringify(products, null, 2)};\nexport default products;`);

    res.json({
      success: true,
      message: 'Upload successful',
      product: { name, price, category, image: imageUrl }
    });
  } catch (error) {
    if (req.file?.filename) {
      fs.unlinkSync(path.join(UPLOADS_DIR, req.file.filename));
    }
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${UPLOADS_DIR}`);
  console.log(`Access debug endpoint: http://localhost:${PORT}/api/debug/uploads`);
});