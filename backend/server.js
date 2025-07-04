const express = require('express');
const cors = require('cors');
const app = express();

// Database
const db = require('./db');

// Routes
const invoicesRouter = require('./routes/invoices');

// Middlewares
const corsOptions = {
  origin: 'https://invoice.saqiicoditz.online',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/invoices', invoicesRouter);

// Test route
app.get('/', (req, res) => {
    res.send('Invoicing System Backend Running ðŸš€');
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
