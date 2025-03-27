## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# FitPrice

## 📌 Project Overview

This project is a *web scraper* built using *Puppeteer* that helps users find the best deals on supplements and related products. Users input their desired product name and budget range, and the scraper fetches matching product listings from multiple e-commerce websites, providing a side-by-side comparison of prices.

##  Features

-  *Search Functionality*: Users input product name.
-  *Multi-Website Scraping*: Fetches results from multiple e-commerce platforms.
-  *Price-Based Filtering*: Only shows products within the user-defined input.
-  *Product Details Extraction*: Scrapes product name, price, link, and image.
-  *Headless Automation*: Uses Puppeteer for seamless browser automation.
-  *Retry Mechanism*: Handles failures with auto-retries to ensure robustness.

##  Technologies Used

- *Next.js*  (Frontend Framework)
- *Node.js*  (Backend Runtime)
- *Puppeteer* (Web Scraping & Automation)
- *JavaScript/TypeScript*  (Programming Language)

##  How It Works

1. *User Input*: Choose from the given options.
2. *Web Scraping*: Puppeteer visits e-commerce websites and extracts relevant product details.
3. *Data Filtering*: Only products that are selected are displayed.
4. *Output*: Displays the results in a structured format (console, JSON file, or web interface).

##  Installation & Setup

### Prerequisites

- Install *Google Chrome* (optional, if not using Puppeteer bundled Chromium)

### Steps to Run

1. Clone this repository:
   bash
   git clone https://github.com/Mananalik/Fitprice.git
   
2. Install dependencies:
   bash
   npm install
   
3. Run the scraper:
   bash
   npm run dev
   
4. Enter the product details when prompted.



##  Notes

- *Amazon & Flipkart Blocking: These sites have strict bot detection; using a **proxy rotation service* is recommended.
- *Legal Compliance: Ensure scraping complies with **website terms of service*.
- *Performance Optimization*: Reduce scraping frequency to avoid IP bans.

## Contributions

We welcome contributions! Feel free to fork this repository and submit *pull requests*.

##  Credits

Developed by *Saumil Singh Rana* and *Manan Malik*

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
