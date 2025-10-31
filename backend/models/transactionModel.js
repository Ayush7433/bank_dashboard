const db = require('../db');

//function to get transactions with filters
async function getTransactions(filters = {}, limit = 100) {
  let sql = 'SELECT * FROM transactions WHERE 1=1';
  const params = [];

  if (filters.account_id) {
    sql += ' AND account_id = ?';
    params.push(filters.account_id);
  }
  if (filters.type) {
    sql += ' AND type = ?';
    params.push(filters.type);
  }
  if (filters.currency) {
    sql += ' AND currency = ?';
    params.push(filters.currency);
  }
  if (filters.start_date && filters.end_date) {
    sql += ' AND DATE(created_at) BETWEEN ? AND ?';
    params.push(filters.start_date, filters.end_date);
  }
  if (filters.min_amount) {
    sql += ' AND amount >= ?';
    params.push(filters.min_amount);
  }
  if (filters.max_amount) {
    sql += ' AND amount <= ?';
    params.push(filters.max_amount);
  }
  if (filters.description) {
    sql += ' AND description LIKE ?';
    params.push(`%${filters.description}%`);
  }
  if (filters.min_balance_after) {
    sql += ' AND balance_after >= ?';
    params.push(filters.min_balance_after);
  }
  if (filters.max_balance_after) {
    sql += ' AND balance_after <= ?';
    params.push(filters.max_balance_after);
  }

  sql += ' ORDER BY created_at DESC LIMIT ?';
  params.push(Number(limit));

  const [rows] = await db.query(sql, params);
  return rows;
}

async function createTransaction(data = {}) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { account_id, type, amount, description } = data;
    if (!account_id || !amount || !type || !description) {
      throw new Error("Missing required fields");
    }
    const [accRows] = await conn.query('SELECT balance FROM accounts WHERE id = ? FOR UPDATE', [account_id]);
    if (!accRows.length) throw new Error('Account not found');

    let balance = parseFloat(accRows[0].balance);
    let newBalance = balance;
    if (type === 'DEBIT') {
      newBalance -= parseFloat(amount);
    } else {
      newBalance += parseFloat(amount);
    }

    await conn.query(
      'INSERT INTO transactions (account_id,type,amount,description,balance_after) VALUES (?,?,?,?,?)',
      [account_id, type, amount, description, newBalance]
    );
    await conn.query('UPDATE accounts SET balance = ? WHERE id = ?', [newBalance, account_id]);

    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { getTransactions, createTransaction };
