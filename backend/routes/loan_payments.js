const express = require('express');
const router = express.Router();
const db = require('../db');

// List all loan payments
router.get('/', async (req, res) => {
    try {
        let sql = 'SELECT * FROM loan_payments WHERE 1=1';
        const params = [];

        if (req.query.loan_id) {
            sql += ' AND loan_id = ?';
            params.push(req.query.loan_id);
        }

        sql += ' ORDER BY payment_date DESC';
        const [rows] = await db.execute(sql, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Add new loan payment
router.post('/', async (req, res) => {
    try {
        const { loan_id, payment_date, amount, status } = req.body;

        if (!loan_id || !payment_date || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const sql = `
            INSERT INTO loan_payments (loan_id, payment_date, amount, status)
            VALUES (?, ?, ?, ?)
            `;

        const [result] = await db.query(sql, [
            loan_id,
            payment_date,
            amount,
            status || 'PAID']
        );

        //Update loan outstanding amount
        await db.query('UPDATE loans SET outstanding = outstanding - ? WHERE id = ?', [amount, loan_id]);

        await db.query(
            "INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)",
            [req.user.id, "Created Loan Payment", JSON.stringify({ payment_id: result.insertId, ...req.body })]
        );

        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Delete loan payment
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [payment] = await db.query('SELECT * FROM loan_payments WHERE id = ?', [id]);
        if (payment.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        const { loan_id, amount } = payment[0];

        //Restore loan outstanding
        await db.query('UPDATE loans SET outstanding = outstanding + ? WHERE id = ?', [amount, loan_id]);

        await db.query('DELETE FROM loan_payments WHERE id = ?', [id]);

        await db.query(
            "INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)",
            [req.user.id, "Deleted Loan Payment", JSON.stringify({ payment_id: id })]
        );

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;