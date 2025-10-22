-- schema.sql: Banking / Finance Management

DROP DATABASE IF EXISTS bank_dashboard;
CREATE DATABASE bank_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bank_dashboard;

-- 1. users (system users / staff)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. customers
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(150),
  phone VARCHAR(30),
  address TEXT,
  dob DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. accounts
CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  account_number VARCHAR(34) NOT NULL UNIQUE,
  account_type ENUM('SAVINGS','CURRENT','LOAN','FD') DEFAULT 'SAVINGS',
  currency VARCHAR(10) DEFAULT 'INR',
  balance DECIMAL(18,2) DEFAULT 0.00,
  branch_id INT,
  opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('ACTIVE','CLOSED','SUSPENDED') DEFAULT 'ACTIVE',
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 4. branches
CREATE TABLE branches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  address TEXT,
  city VARCHAR(100),
  ifsc VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. transactions
CREATE TABLE transactions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  type ENUM('DEBIT','CREDIT') NOT NULL,
  amount DECIMAL(18,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  balance_after DECIMAL(18,2),
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- 6. cards
CREATE TABLE cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT,
  card_number VARCHAR(20),
  card_type ENUM('DEBIT','CREDIT'),
  status ENUM('ACTIVE','BLOCKED','EXPIRED') DEFAULT 'ACTIVE',
  expiry DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

-- 7. loans
CREATE TABLE loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT,
  principal DECIMAL(18,2),
  interest_rate DECIMAL(5,2),
  term_months INT,
  outstanding DECIMAL(18,2),
  status ENUM('ONGOING','PAID','DEFAULTED') DEFAULT 'ONGOING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

-- 8. deposits (fixed deposits)
CREATE TABLE deposits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT,
  amount DECIMAL(18,2),
  start_date DATE,
  maturity_date DATE,
  interest_rate DECIMAL(5,2),
  status ENUM('ACTIVE','MATURED') DEFAULT 'ACTIVE',
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

-- 9. beneficiaries
CREATE TABLE beneficiaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  name VARCHAR(150),
  account_number VARCHAR(34),
  bank_name VARCHAR(150),
  ifsc VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 10. payments (scheduled or immediate payments)
CREATE TABLE payments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  from_account INT,
  to_account INT,
  amount DECIMAL(18,2),
  status ENUM('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING',
  schedule_date DATE,
  executed_at TIMESTAMP NULL,
  FOREIGN KEY (from_account) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY (to_account) REFERENCES accounts(id) ON DELETE SET NULL
);

-- 11. statements (monthly statements reference)
CREATE TABLE statements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT,
  period_start DATE,
  period_end DATE,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file_path VARCHAR(255),
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- 12. audit_logs
CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 13. currencies
CREATE TABLE currencies (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100),
  symbol VARCHAR(10)
);

-- 14. exchange_rates
CREATE TABLE exchange_rates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_currency VARCHAR(10),
  to_currency VARCHAR(10),
  rate DECIMAL(18,6),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_currency) REFERENCES currencies(code),
  FOREIGN KEY (to_currency) REFERENCES currencies(code)
);

-- 15. budgets (customer budgets/categories)
CREATE TABLE budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  name VARCHAR(150),
  monthly_amount DECIMAL(18,2),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 16. categories (expense/income categories)
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  type ENUM('EXPENSE','INCOME'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. notifications
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  message VARCHAR(255),
  read_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 18. employees (bank employees)
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150),
  email VARCHAR(150),
  phone VARCHAR(30),
  position VARCHAR(100),
  branch_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

-- Loan Payments (instalments towards a loan)
CREATE TABLE loan_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  loan_id INT NOT NULL,
  payment_date DATE NOT NULL,
  amount DECIMAL(18,2) NOT NULL,
  status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PAID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
);

-- seed a couple of currencies
INSERT INTO currencies (code, name, symbol) VALUES ('INR','Indian Rupee','₹'),('USD','US Dollar','$');

-- optional: sample customer, account, transaction
INSERT INTO customers (first_name,last_name,email,phone,address) VALUES ('Amit','Kumar','amit@example.com','+919000000001','Mumbai, India');
INSERT INTO branches (name,address,city,ifsc) VALUES ('Main Branch','123 Main Street','Mumbai','IFSC0001');
INSERT INTO accounts (customer_id, account_number, account_type, currency, balance, branch_id) VALUES (1,'INR0000000001','SAVINGS','INR',50000.00,1);
INSERT INTO transactions (account_id,type,amount,description,balance_after) VALUES (1,'CREDIT',50000.00,'Initial deposit',50000.00);
