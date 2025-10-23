// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// import routers
const authMiddleware = require('./middleware/authMiddleware');
app.use('/api', authMiddleware); // Protect all /api routes

const accountsRouter = require('./routes/accounts');
const transactionsRouter = require('./routes/transactions');
const customersRouter = require('./routes/customers');
const loansRouter = require('./routes/loans');
const loanPaymentsRouter = require('./routes/loan_payments');
const dashboardRouter = require('./routes/dashboard');


app.use('/api/accounts', accountsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/loans', loansRouter);
app.use('/api/loan_payments', loanPaymentsRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/', (req, res) => {
  res.json({ msg: 'Bank Dashboard API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
