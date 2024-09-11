const pdfService = require('../services/pdfService');
const invoiceCalculations = require('../utils/invoiceCalculations');

exports.generateInvoice = (req, res) => {
  try {
    const invoiceData = req.body;
    const calculatedInvoiceData = invoiceCalculations.calculateInvoice(invoiceData);
    const pdfBuffer = pdfService.generatePDF(calculatedInvoiceData);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Error generating invoice' });
  }
};