const express = require('express');
const router = express.Router();
const Account = require('../models/accountModel');

// GET /api/accounts
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const accounts = await Account.getAllAccounts(limit);
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/accounts/:id
router.get('/:id', async (req, res) => {
  try {
    const acc = await Account.getAccountById(req.params.id);
    res.json(acc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/accounts
router.post('/', async (req, res) => {
  try {
    const id = await Account.createAccount(req.body);
    await db.query(
      "INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)",
      [req.user.id, "Created Account", JSON.stringify({ account_id: id, ...req.body })]
    );
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/accounts/:id
router.put('/:id', async (req, res) => {
  try {
    await Account.updateAccount(req.params.id, req.body);
    await db.query(
      "INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)",
      [req.user.id, "Updated Account", JSON.stringify({ account_id: req.params.id, ...req.body })]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Account.deleteAccount(req.params.id);
    await db.query(
      "INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)",
      [req.user.id, "Deleted Account", JSON.stringify({ account_id: req.params.id })]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
