// app/api/search/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface Product {
  name: string;
  price: string;
  image: string;
  url: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product = searchParams.get('product');
  const weight = searchParams.get('weight');
  const flavor = searchParams.get('flavor');

  // Validate user inputs
  if (!product || !weight || !flavor) {
    return NextResponse.json(
      { error: 'Missing parameters. Please provide product, weight, and flavor.' },
      { status: 400 }
    );
  }

  try {
    // Construct the search query
    const query = `${product} ${weight} ${flavor}`;

    // Scrape Amazon using Puppeteer
    const results = await scrapeAmazon(query);

    // Return the results
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error scraping website:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data. Please try again later.' },
      { status: 500 }
    );
  }
}

async function scrapeAmazon(query: string): Promise<Product[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.amazon.in/s?k=${encodeURIComponent(query)}`, {
    waitUntil: 'networkidle2',
  });

  const results = await page.evaluate(() => {
    const products: Product[] = [];
    document.querySelectorAll('.s-result-item').forEach((element) => {
      const name = element.querySelector('h2')?.textContent?.trim() || '';
      const price = element.querySelector('.a-price-whole')?.textContent?.trim() || '';
      const image = element.querySelector('img')?.getAttribute('src') || '';
      const url = element.querySelector('a')?.getAttribute('href') || '';

      if (name && price && image && url) {
        products.push({ name, price, image, url: `https://www.amazon.in${url}` });
      }
    });
    return products;
  });

  await browser.close();
  return results;
}