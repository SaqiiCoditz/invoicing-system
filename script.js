let invoiceItems = [];
let invoiceCounter = 1;

// Auto-fetch Invoice Number from server
fetch("https://invoice.learnwithsaqii.online/api/invoices/next-number")
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const nextNumber = data.nextInvoiceNumber;
            document.getElementById("invoice-id").value = `INV-${String(nextNumber).padStart(3, "0")}`;
        } else {
            alert("Error fetching invoice number from server.");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Error connecting to server.");
    });

// Auto-fill today's date and invoice ID
window.addEventListener("DOMContentLoaded", function () {
    const today = new Date().toISOString().substr(0, 10);
    document.getElementById("invoice-date").value = today;
});

// Add items
document.getElementById("add-item-btn").addEventListener("click", function () {
    const name = document.getElementById("item-name").value.trim();
    const price = parseFloat(document.getElementById("item-price").value);

    if (!name || isNaN(price)) {
        alert("Please enter item name and price.");
        return;
    }

    invoiceItems.push({ name, price });
    updateItemsTable();
    clearItemInputs();
});

// Update items table
function updateItemsTable() {
    const tbody = document.querySelector("#items-table tbody");
    tbody.innerHTML = "";

    invoiceItems.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td><button onclick="removeItem(${index})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });

    const grandTotal = invoiceItems.reduce((sum, item) => sum + item.price, 0);
    document.getElementById("invoice-total").textContent = grandTotal.toFixed(2);
}

// Clear item inputs
function clearItemInputs() {
    document.getElementById("item-name").value = "";
    document.getElementById("item-price").value = "";
}

// Remove item
function removeItem(index) {
    invoiceItems.splice(index, 1);
    updateItemsTable();
}

// Save invoice
document.getElementById("save-invoice-btn").addEventListener("click", function () {
    const clientName = document.getElementById("client-name").value.trim();
    const invoiceDate = document.getElementById("invoice-date").value;

    if (!clientName || !invoiceDate || invoiceItems.length === 0) {
        alert("Please fill all fields and add at least 1 item.");
        return;
    }

    const invoiceId = document.getElementById("invoice-id").value;

  const invoiceData = {
    invoiceNumber: invoiceId,
    date: invoiceDate,
    clientName: clientName,
    items: JSON.stringify(invoiceItems), // ✅ only names
    total: document.getElementById("invoice-total").textContent
};



    fetch("https://invoice.learnwithsaqii.online/api/invoices", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(invoiceData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`✅ Invoice saved to database! Invoice ID: ${invoiceId}`);

            // Increment invoice number after save
            fetch("http://localhost:5000/api/invoices/next-number")
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const nextNumber = data.nextInvoiceNumber;
                        document.getElementById("invoice-id").value = `INV-${String(nextNumber).padStart(3, "0")}`;
                    }
                });

            // Clear form
            document.getElementById("client-name").value = "";
            invoiceItems = [];
            updateItemsTable();
        } else {
            alert("❌ Error saving invoice. Please try again.");
        }
    })
    .catch(err => {
        console.error(err);
        alert("❌ Server error saving invoice.");
    });
});


// Preview invoice
document.getElementById("preview-invoice-btn").addEventListener("click", function () {
    const clientName = document.getElementById("client-name").value.trim();
    const invoiceDate = document.getElementById("invoice-date").value;
    const invoiceId = document.getElementById("invoice-id").value;
    const total = document.getElementById("invoice-total").textContent;

    if (!clientName || !invoiceDate || invoiceItems.length === 0) {
        alert("Please fill all fields and add at least 1 item.");
        return;
    }

    let html = `
    <div style="
    max-width: 850px;
    padding: 16px;
    margin: 0 auto;
    background: white;
    border: 1px solid #eee;
    border-radius: 12px;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    overflow: hidden;
    position: relative;
    ">
        <div style="position: absolute; top: 20px; right: 20px; opacity: 0.03; font-size: 6rem; transform: rotate(-25deg); pointer-events: none;">Dizzy SMM</div>

        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; border-bottom:2px solid #2563eb; padding-bottom:15px; margin-bottom:25px;">
            <div style="flex:1 1 50%;">
                <h2 style="color:#2563eb; margin:0;">${document.getElementById("business-name").value}</h2>
                <p style="margin:10px 0 0;">Invoice ID: <strong>${invoiceId}</strong></p>
                <p style="margin:4px 0;">Date: <strong>${invoiceDate}</strong></p>
            </div>
            <div style="flex:1 1 40%; text-align:right;">
                <p style="margin:4px 0;">Client:</p>
                <h3 style="margin:0; color:#f97316;">${clientName}</h3>
            </div>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <thead>
                <tr style="background:#f0f4ff;">
                    <th style="padding:14px; border:1px solid #ccc; text-align:left;">Item</th>
                    <th style="padding:14px; border:1px solid #ccc; text-align:right;">Price (PKR)</th>
                </tr>
            </thead>
            <tbody>`;

    invoiceItems.forEach(item => {
        html += `
            <tr>
                <td style="padding:12px; border:1px solid #eee;">${item.name}</td>
                <td style="padding:12px; border:1px solid #eee; text-align:right;">${item.price.toFixed(2)}</td>
            </tr>`;
    });

    html += `
            </tbody>
        </table>

        <div style="text-align:right; margin-top:20px; font-size:1.6rem; color:#2563eb;">
            Total: PKR <strong>${total}</strong>
        </div>

        <div style="margin-top:30px; font-size:0.95rem; color:#555; text-align:center; border-top:1px solid #ddd; padding-top:12px;">
            Thank you for your business! 🚀 <br/>
            <small>Created with love and honesty</small>
        </div>
    </div>
    `;

    document.getElementById("preview-content").innerHTML = html;
    document.getElementById("invoice-preview").style.display = "block";
});

// Export PNG
document.getElementById("export-png-btn").addEventListener("click", function () {
    html2canvas(document.getElementById("preview-content")).then(canvas => {
        const link = document.createElement("a");
        const invoiceId = document.getElementById("invoice-id").value;
        link.download = `${invoiceId}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
});
