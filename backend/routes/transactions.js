const express = require('express');
const router = express.Router();
const Tx = require('../models/transactionModel');

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const rows = await Tx.getTransactions(limit);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    await Tx.createTransaction(req.body);
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
