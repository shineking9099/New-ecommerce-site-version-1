
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'your_secure_secret_key_here';
exports.SECRET_KEY = SECRET_KEY;

const ADMIN_CREDS = { username: 'admin', password: 'admin123' };

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1d' });
        return res.json({ success: true, token, user: { username } });
    }

    res.status(401).json({ success: false, error: 'Invalid credentials' });
});

module.exports = router;