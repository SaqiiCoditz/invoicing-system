CREATE DATABASE invoicing_db;
USE invoicing_db;

CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoiceNumber VARCHAR(50),
    date DATE,
    clientName VARCHAR(100),
    items TEXT,
    total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
