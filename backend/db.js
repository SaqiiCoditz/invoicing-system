const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost', // most cPanel servers use localhost, unless yours shows otherwise
    user: 'saqiicod_invoicing_db',
    password: 'saqiicod_invoicing_db',
    database: 'saqiicod_invoicing_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ MySQL connected');
    }
});

module.exports = db;
