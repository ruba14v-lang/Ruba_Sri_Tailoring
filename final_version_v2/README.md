# RUBA SRI LADIES TAILORING — VERSION 2

Full-stack-ready business website with:
- customer-facing storefront
- service catalogue
- portfolio
- enquiry/booking form
- localStorage cart/order draft
- admin dashboard
- customer records
- measurements
- order tracking
- quote management
- dashboard stats
- WhatsApp handoff
- JSON export/import for backup
- responsive UI

## Run
This version runs as a browser MVP without a database:
`python -m http.server 5600`
Open `http://localhost:5600`.

## Important
Edit `assets/js/config.js` and replace the WhatsApp number.

## Data
Version 2 stores demo/admin data in browser localStorage. It is NOT a multi-device production database.

## Production upgrade
Replace the localStorage repository with Node.js + Express + MongoDB APIs, add authentication, cloud image storage, Razorpay/UPI payment links, server-side validation, backups and deployment.
