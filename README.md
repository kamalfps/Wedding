# Everlight Studio — Photography Website & Quotation Builder

A responsive static website starter for a photography / videography business. Includes a marketing website, interactive quotation builder, INR price calculations, add-ons and client-side PDF proposal generation.

## Files
- `index.html` — website structure
- `style.css` — responsive styling
- `script.js` — studio settings, demo package prices, quote calculation and PDF generation
- `sample-quotation.pdf` — visual sample proposal

## Important setup before publishing
1. Open `script.js`.
2. Change the `STUDIO` name, WhatsApp number, email and city.
3. Replace the sample `PACKAGES` and `ADDONS` prices/descriptions with the friend's real pricing.
4. Replace the Unsplash demo photographs in `style.css` with licensed portfolio images. Use the friend's own work wherever possible.
5. Update the page title and brand text in `index.html` if desired.

## Run locally
Open `index.html` in a browser. Internet is needed for Google Fonts, Unsplash demo images and the jsPDF CDN. PDF generation happens in the visitor's browser; no server is required.

## Publish with GitHub Pages
1. Create a GitHub repository, e.g. `photography-studio`.
2. Upload all files in this folder to the repository root.
3. Go to **Settings → Pages**.
4. Under Build and deployment choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site.

## Current limitations / production notes
- This is a static website. Quote PDFs are generated in the browser.
- Client records and quote history are not synced to a database or shared between devices. This starter does not include secure login, payment processing, admin roles, or cloud backups.
- Do not collect sensitive customer information until you add an appropriate privacy notice and secure backend.
- Add real business terms, cancellation policy, GST/tax details (if applicable), delivery timelines and payment milestones before sending proposals.
- Check image licences and obtain permission to display client photographs.
