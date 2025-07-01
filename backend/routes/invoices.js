// routes/invoices.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all invoices
router.get('/', (req, res) => {
    db.query('SELECT * FROM invoices ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Error fetching invoices:', err);
            res.json({ success: false });
        } else {
            res.json(results);
        }
    });
});

//Fetch invoice number
router.get('/next-number', (req, res) => {
    const query = `
        SELECT MAX(CAST(SUBSTRING(invoiceNumber, 5) AS UNSIGNED)) AS maxNum 
        FROM invoices 
        WHERE invoiceNumber REGEXP '^INV-[0-9]+$'
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            console.error('Failed Query:', query);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error: ' + err.message,
                sqlError: err.sqlMessage  // Include SQL error details
            });
        }

        console.log('Query Results:', results); // Log actual results
        
        if (results.length === 0 || results[0].maxNum === null) {
            console.log('No valid invoices found - starting from 1');
            return res.json({ success: true, nextInvoiceNumber: 1 });
        }

        const nextNumber = results[0].maxNum + 1;
        res.json({ success: true, nextInvoiceNumber: nextNumber });
    });
});

// POST create new invoice
router.post('/', (req, res) => {
    const { invoiceNumber, date, clientName, orderId, items, total } = req.body;
    db.query(
'INSERT INTO invoices (invoiceNumber, date, clientName, orderId, items, total) VALUES (?, ?, ?, ?, ?, ?)',
[invoiceNumber, date, clientName, orderId, items, total]
,
        (err, result) => {
            if (err) {
                console.error('Error saving invoice:', err);
                res.json({ success: false });
            } else {
                res.json({ success: true, insertId: result.insertId });
            }
        }
    );
});

// ðŸŸ¢ This is the route you are missing in invoicesRouter
router.get('/:id', (req, res) => {
    const invoiceId = req.params.id;

    db.query(
        'SELECT * FROM invoices WHERE id = ?',
        [invoiceId],
        (err, results) => {
            if (err) {
                console.error('Error fetching invoice:', err);
                res.json({ success: false, message: 'Database error.' });
            } else if (results.length === 0) {
                res.json({ success: false, message: 'Invoice not found.' });
            } else {
                res.json({ success: true, invoice: results[0] });
            }
        }
    );
});

// DELETE invoice by ID
router.delete('/:id', (req, res) => {
    const invoiceId = req.params.id;
    const { passcode } = req.body;

    const ADMIN_PASSCODE = "0911"; // Change this!

    if (passcode !== ADMIN_PASSCODE) {
        return res.status(403).json({ success: false, message: "Invalid passcode." });
    }

    db.query('DELETE FROM invoices WHERE id = ?', [invoiceId], (err, result) => {
        if (err) {
            console.error('Error deleting invoice:', err);
            res.json({ success: false, message: 'Database error.' });
        } else {
            res.json({ success: true });
        }
    });
});



module.exports = router;
