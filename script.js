document.addEventListener("DOMContentLoaded", function() {
    const collectDataForm = document.getElementById("collect-data");
    const advanceForm = document.getElementById("advance-form");
    const invoiceList = document.getElementById("invoice-list");
    const downloadBtn = document.getElementById("downloadBtn");
    
    let companyName = "";
    let email = "";
    let mobileNum = "";

    // Handle company details form submission
    document.getElementById("company-form").addEventListener("submit", function(event) {
        event.preventDefault();
        companyName = document.getElementById("company-name").value;
        email = document.getElementById("email").value;
        mobileNum = document.getElementById("mobile-num").value;

        // Optionally, show confirmation or handle UI changes
        alert("Company details saved!");
    });

    // Handle adding invoice data
    collectDataForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const srNo = document.getElementById("sr-no").value;
        const purpose = document.getElementById("Purpose").value;
        const size = document.getElementById("size").value;
        const foot = document.getElementById("foot").value;
        const rate = document.getElementById("rate").value;
        
        // Calculate amount
        const amount = foot * rate;

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${srNo}</td>
            <td>${purpose}</td>
            <td>${size}</td>
            <td>${foot}</td>
            <td>${rate}</td>
            <td>${amount}</td>
        `;

        invoiceList.appendChild(newRow);

        // Clear input fields
        collectDataForm.reset();
    });

    // Handle downloading PDF
    downloadBtn.addEventListener("click", function() {
        if (!companyName || !email || !mobileNum) {
            alert("Please fill in company details before downloading the PDF.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Get advance payment
        const advancePayment = parseFloat(document.getElementById("advance-payment").value) || 0;

        // Add "Invoice" heading
        doc.setFontSize(22);
        doc.setTextColor(30, 144, 255); // Dodger Blue
        doc.text("Invoice", 105, 20, { align: 'center' });

        // Reset text size and color
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black

        // Add company details to PDF
        doc.text(`Company Name: ${companyName}`, 14, 30);
        doc.text(`Email: ${email}`, 14, 38);
        doc.text(`Mobile Number: ${mobileNum}`, 14, 46);

        // Get table data
        const headers = ["Sr.No", "Purpose", "Size", "Foot", "Rate", "Amount"];
        const rows = Array.from(invoiceList.querySelectorAll("tr")).map(row =>
            Array.from(row.querySelectorAll("td")).map(cell => cell.innerText)
        );

        // Calculate total amount
        let totalAmount = 0;
        rows.forEach(row => {
            const amount = parseFloat(row[5]) || 0;
            totalAmount += amount;
        });

        // Add table to PDF
        doc.autoTable({
            startY: 56,
            head: [headers],
            body: rows,
            theme: 'striped',
            margin: { left: 14, right: 14 }
        });

        // Calculate balance amount
        const balanceAmount = totalAmount - advancePayment;

        // Add total amount, advance payment, and balance to PDF with styling
        const finalY = doc.lastAutoTable.finalY + 10;
        const infoStartY = finalY + 10;

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0); // Black for amounts
        doc.setFont("helvetica", "bold");
        
        // Total Amount
        doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, 14, infoStartY);
        // Advance Payment
        doc.text(`Advance Payment: ${advancePayment.toFixed(2)}`, 14, infoStartY + 10);
        // Balance Amount
        doc.text(`Balance Amount: ${balanceAmount.toFixed(2)}`, 14, infoStartY + 20);

        doc.save("Invoice_Summary.pdf");
    });
});
