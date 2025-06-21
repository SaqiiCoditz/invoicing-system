const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

// Routes
const invoicesRouter = require('./routes/invoices');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/invoices', invoicesRouter);

// Test route
app.get('/', (req, res) => {
    res.send('Invoicing System Backend Running 🚀');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
