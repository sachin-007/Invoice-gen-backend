// const express = require("express");
// const cors = require("cors");
// const invoiceRoutes = require("./routes/invoiceRoutes");
// const session = require('express-session');
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));
// app.use(cors());
// app.use(express.json());

// // Session Middleware
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // Change to true for https
// }));

// // Routes
// const authRoutes = require('./routes/authRoutes');
// const clientRoutes = require('./routes/clientRoutes');
// const ninServerRoutes = require('./routes/ninInvoiceRoutes')

// app.use('/api/auth', authRoutes);
// app.use('/api/clients', clientRoutes);
// app.use('/api/invoices', ninServerRoutes);

// app.use("/api", invoiceRoutes);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const axios = require("axios");
require("dotenv").config();
const invoiceRoutes = require("./routes/invoiceRoutes");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      sameSite: "none", // Allows cross-origin requests to send cookies
    },
  })
);

// Helper function for setting headers
const getHeaders = (token) => ({
  "X-API-TOKEN": token,
  "X-Requested-With": "XMLHttpRequest",
});

app.use((req, res, next) => {
  // console.log("Session:", req.session); // Print session details
  next();
});

app.get("/api/test-token", (req, res) => {
  const token = req.session.token; // Retrieve token from session
  if (!token) return res.status(404).json({ message: "Token not found" });
  res.json({ token });
});

// // Your routes should come after session and CORS middleware
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const response = await axios.post(
//       "https://invoicing.co/api/v1/login",
//       {
//         email,
//         password,
//       },
//       {
//         withCredentials: true,
//       }
//     );

//     const token = response.data.data[0].token.token;
//     req.session.token = token;

//     console.log("ses", req.session.token);

//     res.json({ token });
//   } catch (error) {
//     res.status(401).json({ message: "Invalid email or password" });
//   }
// });

// const checkAuth = (req, res, next) => {
//   console.log("Session in checkAuth:", req.session);
//   if (!req.session.token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   next();
// };

// app.post("/api/clients", checkAuth, async (req, res) => {
//   const clientData = req.body;
//   try {
//     const response = await axios.post(
//       `${process.env.INVOICE_NINJA_API_URL}/clients`,
//       clientData,
//       {
//         headers: {
//           Authorization: `Bearer ${req.session.token}`,
//         },
//       }
//     );

//     res.status(201).json(response.data);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Client creation failed", error: error.response.data });
//   }
// });

const checkAuth = (req, res, next) => {
  const token = req.headers["x-auth-token"];

  // console.log("Token in checkAuth from headers:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Proceed with token validation or verification here if necessary
  next();
};

// Invoice Ninja login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post(
      "https://invoicing.co/api/v1/login",
      {
        email,
        password,
      },
      {
        withCredentials: true, // Include credentials in request
      }
    );

    const token = response.data.data[0].token.token;
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Create Client Route
// app.post("/api/clients", checkAuth, async (req, res) => {
//   console.log(req.session.token);
//   const token = req.cookies.authToken;

//   try {
//     const clientData = req.body;

//     const response = await axios.post(
//       `${process.env.INVOICE_NINJA_API_URL}/clients`,
//       clientData,
//       {
//         headers: getHeaders(token), // Pass the token from cookies in headers
//         withCredentials: true, // Include credentials in request
//       }
//     );

//     res.status(201).json(response.data);
//   } catch (error) {
//     console.error(
//       "Error creating client:",
//       error.response?.data || error.message
//     );
//     res.status(500).json({
//       message: "Client creation failed",
//       error: error.response?.data || error.message,
//     });
//   }
// });

app.post("/api/clients", checkAuth, async (req, res) => {
  // Get the token from headers (custom header 'x-auth-token')
  const token = req.headers["x-auth-token"];

  // console.log("Token in Create Client Route:", token);

  try {
    const {
      first_name,
      last_name,
      phone,
      email,
      password,
      send_email,
      country_id,
    } = req.body;
    // const clientData = req.body;

    // Format client data to the structure expected by the Invoice Ninja API
    const formattedClientData = {
      contacts: [
        {
          first_name,
          last_name,
          phone,
          email,
          password,
          send_email,
        },
      ],
      country_id,
    };

    // Send POST request to Invoice Ninja API with the formatted data
    const response = await axios.post(
      `${process.env.INVOICE_NINJA_API_URL}/clients`,
      formattedClientData,
      {
        headers: getHeaders(token), // Pass the token from the header
        withCredentials: true, // Include credentials in the request
      }
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.error(
      "Error creating client:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Client creation failed",
      error: error.response?.data || error.message,
    });
  }
});

// Fetch All Clients
app.get("/api/clients", checkAuth, async (req, res) => {
  const token = req.headers["x-auth-token"];
  try {
    const response = await axios.get(
      `${process.env.INVOICE_NINJA_API_URL}/clients`,
      {
        headers: getHeaders(token),
      }
    );

    res.status(200).json(response.data.data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve clients",
      error: error.response.data,
    });
  }
});

// // Create Invoice
// app.post("/api/invoices", checkAuth, async (req, res) => {
//   const token = req.headers["x-auth-token"];
//   try {
//     const invoiceData = req.body;

//     // console.log(invoiceData);

//     const response = await axios.post(
//       `${process.env.INVOICE_NINJA_API_URL}/invoices`,
//       invoiceData,
//       {
//         headers: getHeaders(token),
//       }
//     );
//     // console.log(response.data);

//     res.status(201).json(response.data);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Invoice creation failed", error: error.response.data });
//   }
// });




// Create Invoice
app.post("/api/invoices", checkAuth, async (req, res) => {
  const token = req.headers["x-auth-token"];
  try {
    const invoiceData = req.body;

    const response = await axios.post(
      `${process.env.INVOICE_NINJA_API_URL}/invoices`,
      invoiceData,
      {
        headers: getHeaders(token),
      }
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.error(
      "Error creating invoice:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({
        message: "Invoice creation failed",
        error: error.response ? error.response.data : error.message,
      });
  }
});


// get invoices
app.get('/api/invoices', async (req, res) => {
  const token = req.headers["x-auth-token"];
  try {
    const response = await axios.get(`${process.env.INVOICE_NINJA_API_URL}/invoices`, {
      headers: getHeaders(token),
    });
    res.json(response.data);
    // console.log(response.data);
    
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});


// Edit Invoice (optional for later)
app.put("/api/invoices/:id", checkAuth, async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const invoiceData = req.body;

    const response = await axios.put(
      `${process.env.INVOICE_NINJA_API_URL}/invoices/${invoiceId}`,
      invoiceData,
      {
        headers: getHeaders(req.session.token),
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Invoice update failed", error: error.response.data });
  }
});

// Preview Invoice (optional for PDF export)
app.get("/api/invoices/:id/pdf", checkAuth, async (req, res) => {
  try {
    const invoiceId = req.params.id;

    const response = await axios.get(
      `${process.env.INVOICE_NINJA_API_URL}/invoices/${invoiceId}/download`,
      {
        headers: getHeaders(req.session.token),
      }
    );

    res.status(200).json({ pdf_url: response.data });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch invoice PDF",
      error: error.response.data,
    });
  }
});

// Routes
const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const ninServerRoutes = require("./routes/ninInvoiceRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", ninServerRoutes);
app.use("/api", invoiceRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
