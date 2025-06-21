let invoiceItems = [];
let invoiceCounter = localStorage.getItem('invoiceCounter') || 1;

// Auto-fill today's date
window.addEventListener("DOMContentLoaded", function () {
    const today = new Date().toISOString().substr(0, 10);
    document.getElementById("invoice-date").value = today;

    // Auto-fill Invoice ID
    document.getElementById("invoice-id").value = `DS-${String(invoiceCounter).padStart(4, "0")}`;
});

//add items
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

//update items table
function updateItemsTable() {
    const tbody = document.querySelector("#items-table tbody");
    tbody.innerHTML = "";

    invoiceItems.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td><button onclick="removeItem(${index})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });

    const grandTotal = invoiceItems.reduce((sum, item) => sum + item.price, 0);
    document.getElementById("invoice-total").textContent = grandTotal.toFixed(2);
}

//clear items
function clearItemInputs() {
    document.getElementById("item-name").value = "";
    document.getElementById("item-price").value = "";
}

//remove items
function removeItem(index) {
    invoiceItems.splice(index, 1);
    updateItemsTable();
}

//Save invoice
document.getElementById("save-invoice-btn").addEventListener("click", function () {
    const clientName = document.getElementById("client-name").value.trim();
    const invoiceDate = document.getElementById("invoice-date").value;

    if (!clientName || !invoiceDate || invoiceItems.length === 0) {
        alert("Please fill all fields and add at least 1 item.");
        return;
    }

    const invoiceId = `INV-${String(invoiceCounter).padStart(4, "0")}`;

    const invoiceData = {
        id: invoiceId,
        businessName: document.getElementById("business-name").value,
        clientName,
        invoiceDate,
        items: invoiceItems,
        total: document.getElementById("invoice-total").textContent,
        timestamp: new Date().toISOString(),
    };

    let savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    savedInvoices.push(invoiceData);
    localStorage.setItem("invoices", JSON.stringify(savedInvoices));

    invoiceCounter++;
    localStorage.setItem("invoiceCounter", invoiceCounter);

    document.getElementById("invoice-id").value = `INV-${String(invoiceCounter).padStart(4, "0")}`;

    alert(`Invoice saved! Invoice ID: ${invoiceData.id}`);
});

// PREVIEW INVOICE
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
        margin: 5px auto;
        padding: 5px;
        border-radius: 16px;
        background: #ffffff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAABkCAMAAADqvX3PAAAAKlBMVEUAAADX19fX19fBwcHT09PX19fW1tbT09PW1tbV1dXOzs7Ozs7BwcHV1dX5uIg2AAAADnRSTlMAPQAKH0czAAApFAAAAHys1goAAAHwSURBVHja7ZfdcuMwCEb1GUIDcd//dZuk2n5rZzCKOzuzFzo3+XNOBAIHtQosxwi0XUw/jjh2qN1pVzV43FJwJIDLuq5tvaNmzxeEZI5wWP/p9v0gypgGYhGH8fL28yyM7ycOJkFlJW3tZDHhRdBjIO22JR6a1BGMgTAWopvr6BC1jSB1MDWyXYfvkpDlg4iiV83lITiuoXZL+U4/ltcNq2MhogaYBWMYjYU8HHfSRdTrCIOLYImemrfz8dMO6DlVGYyFMWz3tmuGY6GgO1ikXVM51JDXurBO0nyEcyPTnvOXvmyb0hzqfV64jUUYw47Re9CZe6EbeC+M39+TcfK/gTFZuxZgOSag7aMASwGkrQW1Y2lLwXRMx3RMx3T8Pw67FpSOcA5RCccOcTMNL05aRw7Fn2kizA7+1VNH6ENAOBgOxiIK888dHPVqh+Q/yeknzQfHkhx+nqyjT0QFzDUd2Skp53lp7PdFnEkYIhzQv/KRzJUV0QdDSON5+S14CEW0vqSTiAPWWDknCLsY0BZxnNP0L/Z9YQEO8yznXZ2yNwfgTu7rNFgj9aamvS9eZljMTNOeoybSGNwQkvZ+3XrCU07t4HmWSBjDLBzEwdSzhMYcRPRZNYmgdjA1FyahcKQIqpKZs8N0TMd0TMd0/BvHF8n9f8tHo7HcAAAAAElFTkSuQmCC) repeat;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #333;
        position: relative;
        overflow: hidden;
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



// EXPORT PNG
document.getElementById("export-png-btn").addEventListener("click", function () {
    html2canvas(document.getElementById("preview-content")).then(canvas => {
        const link = document.createElement("a");
        const invoiceId = document.getElementById("invoice-id").value;
        link.download = `${invoiceId}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
});
