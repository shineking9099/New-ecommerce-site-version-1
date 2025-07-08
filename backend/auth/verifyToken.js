// backend/auth/verifyToken.js

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./adminAuth'); // ✅ consistent import

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ✅ Correct module export
module.exports = verifyToken;
