const axios = require('axios');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await axios.post(`${process.env.INVOICE_NINJA_API}/login`, { email, password });
        const token = response.data.token;
        req.session.apiToken = token;
        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.response.data });
    }
};
