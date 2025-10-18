const db = require('../db');

async function getCustomers(limit = 100) {
  const [rows] = await db.query('SELECT * FROM customers LIMIT ?', [parseInt(limit)]);
  return rows;
}

async function getCustomerById(id) {
  const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
  return rows[0];
}

async function createCustomer(payload) {
  const { first_name, last_name, email, phone, address, dob } = payload;
  const [res] = await db.query('INSERT INTO customers (first_name,last_name,email,phone,address,dob) VALUES (?,?,?,?,?,?)', [first_name, last_name, email, phone, address, dob]);
  return res.insertId;
}

module.exports = { getCustomers, getCustomerById, createCustomer };
