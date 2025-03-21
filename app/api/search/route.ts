import { NextResponse } from "next/server";
import puppeteer, { Page } from "puppeteer";

interface Product {
  name: string;
  price: string;
  image: string;
  url: string;
  brand?: string;
  rating?: number;
  site: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product = searchParams.get("product");
  const weight = searchParams.get("weight");
  const flavor = searchParams.get("flavor");

  if (!product || !weight || !flavor) {
    return NextResponse.json(
      {
        error:
          "Missing parameters. Please provide product, weight, and flavor.",
      },
      { status: 400 }
    );
  }

  try {
    const query = `${product} ${weight} ${flavor}`;
    const results = await scrapeProducts(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error scraping websites:", error);
    return NextResponse.json(
      { error: "Failed to fetch data. Please try again later." },
      { status: 500 }
    );
  }
}

async function scrapeProducts(query: string): Promise<Product[]> {
  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode (no browser window will open)
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920,1080",
    ],
  });
  const page = await browser.newPage();

  // Set a realistic user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  // Set additional HTTP headers
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  const amazonResults = await scrapeAmazon(page, query);
  const muscleBlazeResults = await scrapeMuscleBlaze(page, query);

  await browser.close();
  return [...amazonResults, ...muscleBlazeResults];
}

async function scrapeAmazon(page: Page, query: string): Promise<Product[]> {
  try {
    await page.goto(`https://www.amazon.in/s?k=${encodeURIComponent(query)}`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    return await page.evaluate(() => {
      const products: Product[] = [];
      document.querySelectorAll(".s-result-item").forEach((element) => {
        const name = element.querySelector("h2")?.textContent?.trim() || "";
        const price =
          element.querySelector(".a-price-whole")?.textContent?.trim() || "";
        const image = element.querySelector("img")?.getAttribute("src") || "";
        const url = element.querySelector("a")?.getAttribute("href") || "";
        const brand =
          element.querySelector(".a-size-base-plus")?.textContent?.trim() || "";
        const ratingText =
          element.querySelector(".a-icon-alt")?.textContent?.trim() || "";
        const rating = parseFloat(ratingText);

        if (name && price && image && url) {
          products.push({
            name,
            price,
            image,
            url: `https://www.amazon.in${url}`,
            brand,
            rating,
            site: "Amazon",
          });
        }
      });
      return products;
    });
  } catch (error) {
    console.error("Error scraping Amazon:", error);
    return [];
  }
}

async function scrapeMuscleBlaze(
  page: Page,
  query: string
): Promise<Product[]> {
  try {
    await page.goto(
      `https://www.muscleblaze.com/search?txtQ=${encodeURIComponent(query)}`,
      {
        waitUntil: "networkidle2",
        timeout: 60000,
      }
    );

    // Wait for product items to load
    await page.waitForSelector(".search-variant-parent-container", {
      timeout: 60000,
    });

    return await page.evaluate(() => {
      const products: Product[] = [];
      document
        .querySelectorAll(".search-variant-parent-container")
        .forEach((element) => {
          const name =
            element.querySelector(".variant-name")?.textContent?.trim() || "";
          const flavorAndWeight =
            element
              .querySelector(".variant-description-details")
              ?.textContent?.trim() || "";
          const fullName = `${name} ${flavorAndWeight}`; // Concatenate name with flavor and weight
          const price =
            element
              .querySelector(".starting-price-from")
              ?.textContent?.trim()
              .replace("₹", "") || ""; // Remove currency symbol
          const image =
            element.querySelector(".variant-img img")?.getAttribute("src") ||
            "";
          const url = element.querySelector("a")?.getAttribute("href") || "";
          const brand = "MuscleBlaze";
          const ratingText =
            element
              .querySelector(".variant-rating-section p")
              ?.textContent?.trim() || "";
          const rating = parseFloat(ratingText);

          console.log({ fullName, price, image, url, brand, rating }); // Log each product

          if (fullName && price && image && url) {
            products.push({
              name: fullName,
              price,
              image,
              url: `https://www.muscleblaze.com${url}`,
              brand,
              rating,
              site: "MuscleBlaze",
            });
          }
        });
      return products;
    });
  } catch (error) {
    console.error("Error scraping MuscleBlaze:", error);
    return [];
  }
}
// Utility function to add random delays
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Example usage of sleep
await sleep(Math.random() * 5000); // Random delay between 0 and 5 seconds
