# Invoice Generator Web App

This is a web application that generates invoices using the NinjaInvoice API. The app allows users to create, list, and edit invoices with a simple and user-friendly interface.

## Features

- **Invoice Creation**: Create custom invoices by entering client and product details.
- **Client creation**: create a new client.
- **Client Selection**: Choose from a list of pre-saved clients or add a new one during the invoice creation process.
- **Itemized Billing**: Add multiple items with descriptions, quantities, and prices.
- **Tax and Discounts**: Supports adding tax and discounts to each invoice.
- **Preview Functionality**: Live preview of the invoice before final submission.
- **Download/Print**: Download the generated invoice as a PDF or print it directly.

## Technology Stack

- **Frontend**: React.js, Next.js
- **Backend**: Node.js, Express
- **API**: NinjaInvoice API
- **Database**: MongoDB (or whichever you're using)
- **Hosting**: Vercel

## Live Demo

- The application is live at: [invoce-generator-ninjainvoice.vercel.app](https://invoce-generator-ninjainvoice.vercel.app)

Previously, it was hosted at: [invoice-generator-psi-beige.vercel.app](https://invoice-generator-psi-beige.vercel.app)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sachin-007/Invoice-gen-backend/
   cd invoice-generator
   ```
   
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables: Create a .env file in the root directory and add the following environment variables:**
  ```bash
      INVOICE_NINJA_API=https://invoicing.co/api/v1
      SESSION_SECRET=sachn007
      SESSION_SECRET=sachn007
      INVOICE_NINJA_API_URL=https://invoicing.co/api/v1
      CLIENT_URL= http://localhost:3000
  ```
4. **Run the application:**
    ```bash
      npm run dev
    ```
## API Integration
  **This app uses the NinjaInvoice API to manage invoices. For the integration, we used the API’s endpoints to:**
  - Create a new invoice
  - Fetch existing invoices
  - Update invoice details
