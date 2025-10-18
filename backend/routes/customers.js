const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    res.json(await Customer.getCustomers(limit));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    res.json(await Customer.getCustomerById(req.params.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const id = await Customer.createCustomer(req.body);
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
