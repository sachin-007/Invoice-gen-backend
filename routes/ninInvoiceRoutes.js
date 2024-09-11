const express = require('express');
const { createInvoice } = require('../controllers/ninjaInvoiceController');
const router = express.Router();

router.post('/', createInvoice);

module.exports = router;