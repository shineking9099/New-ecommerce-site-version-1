// backend/auth/adminAuth.js

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = 'your_secure_secret_key_here';
const ADMIN_CREDS = { username: 'admin', password: 'admin123' };

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1d' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// ✅ Correct, clean module export
module.exports = {
  adminAuthRouter: router,
  SECRET_KEY: SECRET_KEY
};
