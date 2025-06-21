const express = require('express');
const router = express.Router();
const db = require('../db');

// Get next invoice number
router.get('/next-number', (req, res) => {
    const query = 'SELECT COUNT(*) AS count FROM invoices';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching invoice count:', err);
            return res.json({ success: false });
        }

        const count = results[0].count;
        const nextInvoiceNumber = count + 1;

        res.json({ success: true, nextInvoiceNumber });
    });
});

// Save invoice
router.post('/', (req, res) => {
    const { invoiceNumber, date, clientName, items, total } = req.body;

    const sql = `
        INSERT INTO invoices (invoiceNumber, date, clientName, items, total)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [invoiceNumber, date, clientName, items, total], (err, result) => {
        if (err) {
            console.error('Error inserting invoice:', err);
            return res.json({ success: false });
        }

        res.json({ success: true, insertId: result.insertId });
    });
});

// Get all invoices
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM invoices ORDER BY created_at DESC';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching invoices:', err);
            return res.json({ success: false });
        }

        res.json({ success: true, invoices: results });
    });
});

module.exports = router;
