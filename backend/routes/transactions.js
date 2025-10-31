const express = require('express');
const router = express.Router();
const Tx = require('../models/transactionModel');
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const filters = {
      account_id: req.query.account_id,
      type: req.query.type,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      min_amount: req.query.min_amount,
      max_amount: req.query.max_amount
    }

    const limit = req.query.limit || 100;
    const rows = await Tx.getTransactions(filters, limit);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    await Tx.createTransaction(req.body);
    await db.query(
      "INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)",
      [req.user.id, "Created Transaction", JSON.stringify(req.body)]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
