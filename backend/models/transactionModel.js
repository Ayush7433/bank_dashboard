const db = require('../db');

async function getTransactions(limit = 100) {
  const [rows] = await db.query(
    'SELECT t.*, a.account_number FROM transactions t LEFT JOIN accounts a ON t.account_id = a.id ORDER BY t.created_at DESC LIMIT ?',
    [parseInt(limit)]
  );
  return rows;
}

async function createTransaction(tx) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { account_id, type, amount, description } = tx;
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
