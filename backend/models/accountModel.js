const db = require('../db');

async function getAllAccounts(limit = 100) {
  const [rows] = await db.query(
    'SELECT a.*, c.first_name, c.last_name, b.name as branch_name FROM accounts a LEFT JOIN customers c ON a.customer_id=c.id LEFT JOIN branches b ON a.branch_id=b.id LIMIT ?',
    [parseInt(limit)]
  );
  return rows;
}

async function getAccountById(id) {
  const [rows] = await db.query('SELECT * FROM accounts WHERE id = ?', [id]);
  return rows[0];
}

async function createAccount(account) {
  const { customer_id, account_number, account_type, currency, balance, branch_id } = account;
  const [result] = await db.query(
    'INSERT INTO accounts (customer_id, account_number, account_type, currency, balance, branch_id) VALUES (?,?,?,?,?,?)',
    [customer_id, account_number, account_type, currency, balance, branch_id]
  );
  return result.insertId;
}

async function updateAccount(id, patch) {
  const keys = Object.keys(patch);
  if (!keys.length) return;
  const values = keys.map((k) => patch[k]);
  const sql = `UPDATE accounts SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`;
  await db.query(sql, [...values, id]);
}

async function deleteAccount(id) {
  await db.query('DELETE FROM accounts WHERE id = ?', [id]);
}

module.exports = { getAllAccounts, getAccountById, createAccount, updateAccount, deleteAccount };
