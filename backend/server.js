// admin/backend/server.js

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Configure Paths
const UPLOADS_DIR = path.join(__dirname, '..', 'frontend', 'public', 'uploads');

// Ensure uploads directory exists
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));

// Auth Configuration
const SECRET_KEY = 'your_very_secure_secret_key_123';
const ADMIN_USER = {
  username: 'admin',
  password: 'admin123'
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// -------------------- Serve products by category --------------------
function getCategoryData(category) {
  try {
    const dataPath = path.join(__dirname, '..', 'frontend', 'src', 'assets', `${category}.js`);
    delete require.cache[require.resolve(dataPath)];
    
    // Read file contents directly instead of requiring
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    
    // Simple parsing - adjust based on your actual file format
    const data = eval(fileContents.replace('const products =', '').replace('module.exports = products;', '');
    
    // Ensure we always return an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error loading data for ${category}:`, error);
    return [];
  }
}

app.get('/products/:category', (req, res) => {
  const category = req.params.category;
  if (!categories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  const data = getCategoryData(category);
  res.json(data);
});
app.delete('/products/:category/:id', (req, res) => {
  const category = req.params.category;
  const id = req.params.id;

  // Verify authorization
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (!categories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  const dataPath = path.join(__dirname, '..', 'frontend', 'src', 'assets', `${category}.js`);

  try {
    // Read file directly instead of require
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    let products;
    
    // Handle both CommonJS and ES module formats
    if (fileContent.includes('module.exports')) {
      products = eval(fileContent.replace('module.exports =', ''));
    } else if (fileContent.includes('export default')) {
      products = eval(fileContent.replace('export default', ''));
    } else {
      products = eval(fileContent);
    }

    // Ensure products is an array
    if (!Array.isArray(products)) {
      throw new Error('Invalid data format - expected array');
    }

    // String comparison for IDs
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Remove the product
    products.splice(index, 1);

    // Convert back to CommonJS format
    const exportString = `module.exports = ${JSON.stringify(products, null, 2)};\n`;

    // Write back to file
    fs.writeFileSync(dataPath, exportString, 'utf-8');

    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});
// --------------------------------------------------------------------
app.patch('/products/:category/:id', (req, res) => {
  const category = req.params.category;
  const id = req.params.id;
  const { name, price } = req.body;

  if (!categories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  const dataPath = path.join(__dirname, '..', 'frontend', 'src', 'assets', `${category}.js`);

  try {
    delete require.cache[require.resolve(dataPath)];
    let products = require(dataPath);

    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (name !== undefined) products[index].name = name;
    if (price !== undefined) products[index].price = price;

    const exportString = `module.exports = ${JSON.stringify(products, null, 2)};`;

    fs.writeFileSync(dataPath, exportString, 'utf-8');

    res.json({ message: 'Product updated successfully', product: products[index] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${UPLOADS_DIR}`);
  console.log('Login endpoint: POST /api/login');
  console.log('Products endpoint: GET /products/:category');
});