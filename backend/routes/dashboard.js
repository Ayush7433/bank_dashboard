const express = require('express');
const router = express.Router();
const db = require('../db');

//Dashboard metrics API
router.get('/', async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/transactions_by_month', async (req, res) => {
    try {
        const sql = `
            SELECT
                DATE_FORMAT(created_at, "%Y-%m") AS month,
                SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END) AS deposits,
                SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END) AS withdrawals
            FROM transactions
            GROUP BY month
            ORDER BY month ASC
    `;

    const [rows] = await db.query(sql);
    res.json(rows);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;