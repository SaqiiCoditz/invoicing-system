// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Database
const db = require('./db');

// Routes
const invoicesRouter = require('./routes/invoices');

// Middlewares
const corsOptions = {
    origin: 'https://invoice.learnwithsaqii.online',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/invoices', invoicesRouter);

// Test route
app.get('/', (req, res) => {
    res.send('Invoicing System Backend Running 🚀');
});

// Start server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
