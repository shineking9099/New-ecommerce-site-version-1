const express = require('express');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

// 1. Configure Paths Correctly
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const ASSETS_DIR = path.join(__dirname, '..', 'my-ecommerce-admin', 'src', 'assets');

// 2. Ensure Directories Exist
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(ASSETS_DIR, { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// 3. Improved Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// 4. Auth Middleware
const SECRET_KEY = 'your_admin_secret_key';
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// 5. Admin Login Route
app.post('/auth/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1d' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// 6. Product Routes
app.post('/upload', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      // Delete the uploaded file if validation fails
      fs.unlinkSync(path.join(UPLOADS_DIR, req.file.filename));
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = {
      id: Date.now(),
      name,
      price,
      category,
      image: `/uploads/${req.file.filename}`
    };

    // Save to JSON file
    const categoryFile = path.join(ASSETS_DIR, `${category}.js`);
    let products = [];
    
    if (fs.existsSync(categoryFile)) {
      const fileContent = fs.readFileSync(categoryFile, 'utf-8');
      const match = fileContent.match(/=\s*(\[[\s\S]*?\])/);
      if (match) products = JSON.parse(match[1]);
    }

    products.push(product);
    const newContent = `const ${category} = ${JSON.stringify(products, null, 2)};\nexport default ${category};`;
    fs.writeFileSync(categoryFile, newContent);

    res.json({ message: 'Product uploaded successfully', product });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

app.get('/products/:category', (req, res) => {
  try {
    const { category } = req.params;
    const categoryFile = path.join(ASSETS_DIR, `${category}.js`);
    
    if (!fs.existsSync(categoryFile)) {
      return res.json([]);
    }

    const fileContent = fs.readFileSync(categoryFile, 'utf-8');
    const match = fileContent.match(/=\s*(\[[\s\S]*?\])/);
    const products = match ? JSON.parse(match[1]) : [];
    
    res.json(products);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.delete('/products/:category/:id', verifyToken, (req, res) => {
  try {
    const { category, id } = req.params;
    const categoryFile = path.join(ASSETS_DIR, `${category}.js`);
    
    if (!fs.existsSync(categoryFile)) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const fileContent = fs.readFileSync(categoryFile, 'utf-8');
    const match = fileContent.match(/=\s*(\[[\s\S]*?\])/);
    let products = match ? JSON.parse(match[1]) : [];
    
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the image file
    const imagePath = path.join(UPLOADS_DIR, products[index].image.split('/uploads/')[1]);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    products.splice(index, 1);
    const newContent = `const ${category} = ${JSON.stringify(products, null, 2)};\nexport default ${category};`;
    fs.writeFileSync(categoryFile, newContent);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${UPLOADS_DIR}`);
});





/* 

 // backend/server.js  old server tha jo image or text send
const express = require('express');
const fs      = require('fs');
const multer  = require('multer');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = 5000;

// ─── Paths ──────────────────────────────────────────────────────────────────────
const FRONTEND_ROOT = path.join(__dirname, '..', 'my-ecommerce-admin');
const UPLOADS_DIR   = path.join(FRONTEND_ROOT, 'public', 'uploads');
const ASSETS_DIR    = path.join(FRONTEND_ROOT, 'src', 'assets');

// ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// serve images
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(cors());
app.use(express.json());

// ─── Multer (file upload) ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ─── POST /upload ───────────────────────────────────────────────────────────────
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const { name, price, category } = req.body;
  const id    = Date.now();
  const image = `/uploads/${req.file.filename}`;
  const product = { id, name, price, image };

  const filePath = path.join(ASSETS_DIR, `${category}.js`);
  let arr = [];

  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const m   = raw.match(/=\s*(\[[\s\S]*\]);/);
    if (m) arr = JSON.parse(m[1]);
  }

  arr.push(product);
  const newContent = `const ${category} = ${JSON.stringify(arr, null, 2)};\nexport default ${category};\n`;
  fs.writeFileSync(filePath, newContent, 'utf-8');

  res.json({ message: 'Product uploaded successfully' });
});

// ─── GET /products/:category ───────────────────────────────────────────────────
app.get('/products/:category', (req, res) => {
  const filePath = path.join(ASSETS_DIR, `${req.params.category}.js`);
  if (!fs.existsSync(filePath)) {
    return res.json([]);            // return empty array if file not there
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const m   = raw.match(/=\s*(\[[\s\S]*\]);/);
  const arr = m ? JSON.parse(m[1]) : [];
  res.json(arr);
});

// ─── DELETE /products/:category/:id ────────────────────────────────────────────
app.delete('/products/:category/:id', (req, res) => {
  const { category, id } = req.params;
  const filePath = path.join(ASSETS_DIR, `${category}.js`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Not found' });
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const m   = raw.match(/=\s*(\[[\s\S]*\]);/);
  if (!m) return res.status(500).json({ error: 'Parse error' });

  let arr = JSON.parse(m[1]);
  arr = arr.filter((p) => p.id.toString() !== id);

  const newContent = `const ${category} = ${JSON.stringify(arr, null, 2)};\nexport default ${category};\n`;
  fs.writeFileSync(filePath, newContent, 'utf-8');

  res.json({ message: 'Deleted successfully' });
});

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
});
  */
