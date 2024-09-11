const PDFDocument = require('pdfkit');

exports.generatePDF = (invoiceData) => {
  const doc = new PDFDocument();
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  
  doc.rect(50, 50, 100, 50).stroke();
  doc.text('Company Logo', 70, 70);
  
  
  doc.text(`Sold By: ${invoiceData.sellerName}`, 50, 120);
  doc.text(invoiceData.sellerAddress, 50, 140);
  doc.text(`PAN No: ${invoiceData.sellerPAN}`, 50, 160);
  doc.text(`GST Registration No: ${invoiceData.sellerGST}`, 50, 180);
  
  
  doc.text(`Billing Address:`, 300, 120);
  doc.text(invoiceData.billingName, 300, 140);
  doc.text(invoiceData.billingAddress, 300, 160);
  
  
  doc.text(`Shipping Address:`, 300, 200);
  doc.text(invoiceData.shippingName, 300, 220);
  doc.text(invoiceData.shippingAddress, 300, 240);
  
  
  doc.text(`Order Number: ${invoiceData.orderNumber}`, 50, 280);
  doc.text(`Order Date: ${invoiceData.orderDate}`, 50, 300);
  doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 300, 280);
  doc.text(`Invoice Date: ${invoiceData.invoiceDate}`, 300, 300);
  
  
  const startY = 350;
  doc.text('Description', 50, startY);
  doc.text('Unit Price', 200, startY);
  doc.text('Qty', 280, startY);
  doc.text('Net Amount', 320, startY);
  doc.text('Tax Rate', 400, startY);
  doc.text('Tax Amount', 460, startY);
  doc.text('Total Amount', 520, startY);
  
  let currentY = startY + 20;
  
  invoiceData.items.forEach((item) => {
    doc.text(item.description, 50, currentY);
    doc.text(item.unitPrice.toString(), 200, currentY);
    doc.text(item.quantity.toString(), 280, currentY);
    doc.text(item.netAmount.toString(), 320, currentY);
    doc.text(item.taxRate.toString() + '%', 400, currentY);
    doc.text(item.taxAmount.toString(), 460, currentY);
    doc.text(item.totalAmount.toString(), 520, currentY);
    currentY += 20;
  });
  
  
  doc.text(`Total: ${invoiceData.total}`, 520, currentY + 20);
  
  
  doc.text(`Amount in Words: ${invoiceData.amountInWords}`, 50, currentY + 60);
  
  
  doc.text('For Varasiddhi Silk Exports:', 400, currentY + 100);
  doc.rect(400, currentY + 120, 150, 50).stroke();
  doc.text('Authorized Signatory', 420, currentY + 180);
  
  doc.end();
  return Buffer.concat(buffers);
};