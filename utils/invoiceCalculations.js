exports.calculateInvoice = (invoiceData) => {
    const safeNumber = (value) => {
      return isNaN(Number(value)) ? 0 : Number(value); // Fallback to 0 if value is NaN
    };
  
    const calculatedItems = invoiceData.items.map(item => {
      const unitPrice = safeNumber(item.unitPrice);
      const quantity = safeNumber(item.quantity);
      const taxRate = safeNumber(item.taxRate);

      console.log("calculated item",unitPrice,quantity,taxRate);
      
  
      const netAmount = unitPrice * quantity;
      const taxAmount = netAmount * (taxRate / 100);
      const totalAmount = netAmount + taxAmount;
  
      console.log("next calc",netAmount,taxAmount,totalAmount);




      return {
        ...item,
        netAmount: netAmount.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      };
    });
  
    const total = calculatedItems.reduce((sum, item) => sum + safeNumber(item.totalAmount), 0);
    
    return {
        ...invoiceData,
        items: calculatedItems,
        total: total.toFixed(2),
        amountInWords: numberToWords(total),
    };
  };
  


  function numberToWords(num) {
    return `${num} only`;
  }
  