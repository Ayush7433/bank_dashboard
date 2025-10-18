// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// import routers
const accountsRouter = require('./routes/accounts');
const transactionsRouter = require('./routes/transactions');
const customersRouter = require('./routes/customers');

app.use('/api/accounts', accountsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/customers', customersRouter);

app.get('/', (req, res) => {
  res.json({ msg: 'Bank Dashboard API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
