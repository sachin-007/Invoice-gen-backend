const axios = require('axios');

exports.createClient = async (req, res) => {
    const { contacts, country_id } = req.body;
    const apiToken = req.session.apiToken;

    try {
        const response = await axios.post(`${process.env.INVOICE_NINJA_API}/clients`, {
            contacts,
            country_id
        }, {
            headers: {
                'X-API-TOKEN': apiToken,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        res.status(201).json({ message: 'Client created successfully', client: response.data.data });
    } catch (error) {
        res.status(500).json({ error: 'Client creation failed', details: error.response.data });
    }
};
