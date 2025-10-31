const express = require('express');
const router = express.Router();
const db = require('../db');
const { json } = require('body-parser');


//List loans
router.get('/', async (req, res) => {
    try {
        let sql = 'SELECT * FROM loans WHERE 1=1';
        const params = [];

        if (req.query.account_id) {
            sql += ' AND account_id = ?';
            params.push(req.query.account_id);
        }

        sql += ' ORDER BY created_at DESC';

        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new loan
router.post('/', async (req, res) => {
    try {
        const {
            account_id,
            principal,
            interest_rate,
            term_months,
            outstanding,
            status
        } = req.body;

        //Validate required fields
        if (!account_id || !principal || !interest_rate || !term_months) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const sql = `
      INSERT INTO loans (account_id, principal, interest_rate, term_months, outstanding, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

        const [result] = await db.query(sql, [
            account_id,
            principal,
            interest_rate,
            term_months,
            outstanding ?? principal,
            status || 'ONGOING'
        ]);

        await db.query( "INSERT INTO audit_logs (user_id, action, details) VALUES (?,?,?)", 
            [req.user.id, "Created Loan", JSON.stringify({ loan_id: req.params.id, ...req.body})]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Update Loan

router.put('/:id', async (req, res) => {
    try {
        const { principal, interest_rate, term_months, outstanding, status } = req.body;
        const { id } = req.params;

        const sql = `
            UPDATE loans SET
            principal = ?, interest_rate = ?, term_months = ?, outstanding = ?, status = ?
            WHERE id = ?
            `;

        await db.query(sql, [principal, interest_rate, term_months, outstanding, status, id]);
        await db.query( "INSERT INTO audit_logs (user_id, action, details) VALUES (?,?,?)", 
            [req.user.id, "Updated Loan", JSON.stringify({ loan_id: req.params.id, ...req.body})]
        );
        res.json({ ok : true });
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Delete Loan
router.delete('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        await db.query('DELETE FROM loans WHERE id = ?', [id]);
        await db.query( "INSERT INTO audit_logs (user_id, action, details) VALUES (?,?,?)", [req.user.id, "Deleted Loan",
            JSON.stringify({ loan_id: req.params.id, ...req.body})]
        );
        res.json({ ok: true });
    }catch (err){
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;