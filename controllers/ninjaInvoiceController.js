const axios = require('axios');

exports.createInvoice = async (req, res) => {
    const { client_id, number, line_items } = req.body;
    const apiToken = req.session.apiToken;

    try {
        const response = await axios.post(`${process.env.INVOICE_NINJA_API}/invoices`, {
            client_id,
            number,
            line_items
        }, {
            headers: {
                'X-API-TOKEN': apiToken,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        res.status(201).json({ message: 'Invoice created successfully', invoice: response.data.data });
    } catch (error) {
        res.status(500).json({ error: 'Invoice creation failed', details: error.response.data });
    }
};
