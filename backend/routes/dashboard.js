const express = require('express');
const router = express.Router();
const db = require('../db');

//Dashboard metrics API
router.get('/', async (req, res) =>{
    try{
        const [[{ total_customers }]] = await db.query('SELECT COUNT(*) AS total_customers FROM customers');
        const [[{ total_accounts }]] = await db.query('SELECT COUNT(*) AS total_accounts FROM accounts');
        const [[{ total_balance }]] = await db.query('SELECT SUM(balance) AS total_balance FROM accounts');
        const [[{ total_loans }]] = await db.query('SELECT COUNT(*) AS total_loans FROM loans');
        const [[{ outstanding_loans }]] = await db.query('SELECT SUM(outstanding) AS outstanding_loans FROM loans');
        const [[{ total_transactions }]] = await db.query('SELECT COUNT(*) AS total_transactions FROM transactions');
        const [[{ total_deposits }]] = await db.query('SELECT SUM(amount) AS total_deposits FROM transactions WHERE type = "CREDIT"');
        const [[{ total_withdrawals }]] = await db.query('SELECT SUM(amount) AS total_withdrawals FROM transactions WHERE type = "DEBIT"');


        res.json({
            total_customers,
            total_accounts,
            total_balance,
            total_loans,
            outstanding_loans,
            total_transactions,
            total_deposits,
            total_withdrawals
        });
    }catch(err){
        res.status(500).json({ error : err.message });
    }
});

module.exports = router;