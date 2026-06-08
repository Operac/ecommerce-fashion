const escapeHtml = (value) =>
  String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

export const generateInvoicePDF = (receipt, user) => {
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice #${receipt.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-name { font-size: 24px; font-weight: bold; color: #333; }
        .invoice-title { font-size: 18px; margin: 10px 0; }
        .info-section { display: flex; justify-content: space-between; margin: 20px 0; }
        .info-box { width: 45%; }
        .info-box h3 { margin: 0 0 10px 0; color: #333; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .table th { background-color: #f5f5f5; font-weight: bold; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { margin: 5px 0; }
        .grand-total { font-size: 18px; font-weight: bold; color: #333; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">E-Commerce Store</div>
        <div class="invoice-title">INVOICE</div>
        <div>Invoice #${escapeHtml(receipt.id)} | Date: ${escapeHtml(new Date(receipt.receiptDate).toLocaleDateString())}</div>
      </div>

      <div class="info-section">
        <div class="info-box">
          <h3>Bill To:</h3>
          <p>${escapeHtml(user?.email || 'Customer')}<br>
          ${escapeHtml(user?.phone || '')}<br>
          ${escapeHtml(user?.address || '')}</p>
        </div>
        <div class="info-box">
          <h3>Payment Details:</h3>
          <p>Payment Reference: ${escapeHtml(receipt.paymentReference)}<br>
          Payment Date: ${escapeHtml(new Date(receipt.receiptDate).toLocaleDateString())}<br>
          Payment Method: Credit Card</p>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${receipt.receiptItems.map(item => `
            <tr>
              <td>
                ${escapeHtml(item.product.name)}
                ${item.selectedSize ? `<br><small>Size: ${escapeHtml(item.selectedSize)}</small>` : ''}
                ${item.selectedColor ? `<br><small>Color: ${escapeHtml(item.selectedColor)}</small>` : ''}
              </td>
              <td>${escapeHtml(item.quantity)}</td>
              <td>$${escapeHtml(item.unitPrice.toFixed(2))}</td>
              <td>$${escapeHtml(item.totalPrice.toFixed(2))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-row">Subtotal: $${escapeHtml(receipt.totalAmount.toFixed(2))}</div>
        <div class="total-row">Shipping: Free</div>
        <div class="total-row grand-total">Total: $${escapeHtml(receipt.totalAmount.toFixed(2))}</div>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>For questions about this invoice, contact support@ecommerce.com</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};