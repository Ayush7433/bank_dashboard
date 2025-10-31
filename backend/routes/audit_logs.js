const express = require('express');
const router = express.Router();
const db = require('../db');

//Get audit logs with filters

router.get('/', async (req, res) => {
    try{
        let sql = ` 
            SELECT l.*, u.full_name AS user_name,
            u.role FROM audit_logs l
            LEFT JOIN users u ON l.user_id = u.id
            WHERE 1=1`;

        const params = [];
        if ( req.query.user_id ){
            sql += ' AND l.user_id = ?';
            params.push(req.query.user_id);
        }
        if ( req.query.action ){
            sql += ' AND l.action LIKE ?';
            params.push('%${req.query.action}%');
        }
        if (req.query.start_date && req.query.end_date){
            sql += ' AND l.created_at BETWEEN ? AND ?';
            params.push(req.query.start_date, req.query.end_date);
        }
        sql += ' ORDER BY l.created_at DESC LIMIT 200';
        const [rows] = await db.query(sql, params);
        res.json(rows);
    }catch(err){
        res.status(500).json({ error: err.message});
    }
});

module.exports = router;