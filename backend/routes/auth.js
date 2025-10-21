const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

// Register route
router.post('/register', async (req, res) => {

    const { username, password, full_name, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {

        const [existing] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Username already exists." });
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Insert user
        const sql = "INSERT INTO users (username, password_hash, full_name, role) VALUES (?,?,?,?)";
            await db.query(sql, [username, hashedPassword, full_name || null, role || 'customer']);
            res.status(201).json({ message: 'User registered successfully.' });
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ message: "Server error during registration." });
        }
    });

// Login Route

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [results] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'User not found!' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password!' });
        }

        //sign JWT
        const payload = { id: user.id, username: user.username, full_name: user.full_name, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: payload
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;