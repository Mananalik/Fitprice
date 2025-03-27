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
  originalPrice?: string; // Optional field
  reviewCount?: number; // Optional field
  promotion?: string; // Optional field
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
  const optimumnutritionResults = await scrapeOptimum(page, query);
  const nutrabayResults = await scrapeNutrabay(page, query);
  const myProteinResults = await scrapeMyProtein(page, query);
  const nakproResults = await scrapeNakpro(page, query);
  await browser.close();
  return [
    ...amazonResults,
    ...muscleBlazeResults,
    ...optimumnutritionResults,
    ...nutrabayResults,
    ...myProteinResults,
    ...nakproResults,
  ];
}

async function scrapeAmazon(page: Page, query: string): Promise<Product[]> {
  try {
    await page.goto(`https://www.amazon.in/s?k=${encodeURIComponent(query)}`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    return await page.evaluate(() => {
      const products: Product[] = [];
      const elements = Array.from(
        document.querySelectorAll(".s-result-item")
      ).slice(0, 20); // Limit to first 10
      elements.forEach((element) => {
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

    return await page.evaluate(() => {
      const products: Product[] = [];
      const elements = Array.from(
        document.querySelectorAll(".search-variant-parent-container")
      ).slice(0, 10); // Limit to first 10
      elements.forEach((element) => {
        const name =
          element.querySelector(".variant-name")?.textContent?.trim() || "";
        const flavorAndWeight =
          element
            .querySelector(".variant-description-details")
            ?.textContent?.trim() || "";
        const fullName = `${name} ${flavorAndWeight}`;
        const price =
          element
            .querySelector(".starting-price-from")
            ?.textContent?.trim()
            .replace("₹", "") || "";
        let image =
          element.querySelector(".variant-img img")?.getAttribute("src") || "";
        const url = element.querySelector("a")?.getAttribute("href") || "";
        const brand = "MuscleBlaze";
        const ratingText =
          element
            .querySelector(".variant-rating-section p")
            ?.textContent?.trim() || "";
        const rating = parseFloat(ratingText);

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

async function scrapeOptimum(page: Page, query: string): Promise<Product[]> {
  try {
    await page.goto(
      `https://www.optimumnutrition.co.in/splug?search=${encodeURIComponent(
        query
      )}`,
      {
        waitUntil: "networkidle2",
        timeout: 60000,
      }
    );

    return await page.evaluate(() => {
      const products: Product[] = [];
      const elements = Array.from(
        document.querySelectorAll(".product-item")
      ).slice(0, 10); // Limit to first 10
      elements.forEach((element) => {
        const name =
          element.querySelector(".product-name a")?.textContent?.trim() || "";
        const price =
          element
            .querySelector(".price-new")
            ?.textContent?.trim()
            .replace("₹", "")
            .trim() || "";
        const imageContainer = element.querySelector(
          ".image-swap-effect, .image-swap-effect"
        );
        const mainImage =
          imageContainer
            ?.querySelector("img:not(.swap-image)")
            ?.getAttribute("src") || "";
        const url =
          element.querySelector(".product-name a")?.getAttribute("href") || "";
        const brand = "Optimum Nutrition";
        const ratingStars = element.querySelectorAll(
          ".rating .fa-stack .fa-star"
        ).length;

        if (name && price && url) {
          products.push({
            name,
            price,
            image: mainImage,
            url: `https://www.optimumnutrition.co.in/${url}`,
            brand,
            rating: ratingStars,
            site: "Optimum Nutrition",
          });
        }
      });
      return products;
    });
  } catch (error) {
    console.error("Error scraping Optimum Nutrition:", error);
    return [];
  }
}

async function scrapeNutrabay(page: Page, query: string): Promise<Product[]> {
  try {
    await page.goto(
      `https://nutrabay.com/search?q=${encodeURIComponent(query)}`,
      {
        waitUntil: "networkidle2",
        timeout: 60000,
      }
    );

    return await page.evaluate(() => {
      const products: Product[] = [];
      const elements = Array.from(
        document.querySelectorAll(".productListing_productCrad__I_iVP")
      ).slice(0, 10); // Limit to first 10
      elements.forEach((element) => {
        const nameElement = element.querySelector(
          ".twoLineTruncate.plpProduct_product_card__FfvkU"
        );
        const infoElement = element.querySelector(
          ".product_productInfo__GE_f7"
        );
        const name = `${nameElement?.textContent?.trim() || ""} ${
          infoElement?.textContent?.trim() || ""
        }`.trim();
        const priceElement = element.querySelector(
          ".plpProduct_ourPrice___6VZr"
        );
        const price =
          priceElement?.textContent?.trim().replace("₹", "").trim() || "";
        const image = element.querySelector("img")?.getAttribute("src") || "";
        const urlElement = element.querySelector(
          ".plpProduct_productcard__YsXnl"
        );
        const url = urlElement?.getAttribute("href") || "";
        const brand = "Nutrabay";
        const ratingElement = element.querySelector(".Rating_rating__g3c_g");
        const rating = Number(ratingElement?.getAttribute("data-rating")) || 0;

        if (name && price && url) {
          products.push({
            name,
            price,
            image,
            url: `https://nutrabay.com${url}`,
            brand,
            rating,
            site: "Nutrabay",
          });
        }
      });
      return products;
    });
  } catch (error) {
    console.error("Error scraping Nutrabay:", error);
    return [];
  }
}

async function scrapeMyProtein(page: Page, query: string): Promise<Product[]> {
  try {
    await page.goto(
      `https://www.myprotein.co.in/search/?q=${encodeURIComponent(query)}`,
      {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      }
    );

    return await page.evaluate(() => {
      const products: Product[] = [];
      const elements = Array.from(
        document.querySelectorAll("product-card-wrapper")
      ).slice(0, 10); // Limit to first 10
      elements.forEach((element) => {
        try {
          const name =
            element.querySelector(".product-item-title")?.textContent?.trim() ||
            "";
          const priceText =
            element.querySelector(".price")?.textContent?.trim() || "";
          const price = priceText.replace(/[^\d.]/g, "");
          const imgElement = element.querySelector(".first-image");
          const image =
            imgElement?.getAttribute("src") ||
            imgElement?.getAttribute("srcset")?.split(" ")[0] ||
            "";
          const url =
            element
              .querySelector(".product-item-title")
              ?.getAttribute("href") || "";
          const ratingStars = element.querySelectorAll(
            'svg[height="20"][width="20"]'
          );
          let rating = 0;
          ratingStars.forEach((star) => {
            const gradientId = star.querySelector("linearGradient")?.id;
            if (gradientId && gradientId.includes("list-product")) {
              const stop = star.querySelector('stop[offset="100%"]');
              if (stop) rating += 1;
              else if (star.querySelector('stop[offset="45%"]')) rating += 0.45;
            }
          });

          if (name && price && url) {
            products.push({
              name,
              price,
              image,
              url: url.startsWith("http")
                ? url
                : `https://www.myprotein.co.in${url}`,
              brand: "MyProtein",
              rating: Math.round(rating * 10) / 10,
              site: "MyProtein",
            });
          }
        } catch (e) {
          console.error("Error processing product:", e);
        }
      });
      return products;
    });
  } catch (error) {
    console.error("Error scraping MyProtein:", error);
    await page.screenshot({ path: "myprotein-error.png" });
    return [];
  }
}

async function scrapeNakpro(page: Page, query: string): Promise<Product[]> {
  try {
    await page.goto(
      `https://nakpro.com/search?q=${encodeURIComponent(
        query
      )}&options[prefix]=last`,
      {
        waitUntil: "networkidle2",
        timeout: 30000,
      }
    );

    return await page.evaluate(() => {
      const products: Product[] = [];
      const elements = Array.from(
        document.querySelectorAll(".grid-product")
      ).slice(0, 10); // Limit to first 10
      elements.forEach((element) => {
        try {
          const name =
            element
              .querySelector(".grid-product__title--body")
              ?.textContent?.trim() || "";
          const priceText =
            element.querySelector(".ppd-price.blue")?.textContent?.trim() || "";
          const price = priceText.replace(/[^\d.]/g, "").slice(1);
          const imgElement = element.querySelector("img.grid-product__image");
          const image = imgElement?.getAttribute("src") || "";
          const url =
            element
              .querySelector("a.grid-product__link")
              ?.getAttribute("href") || "";

          if (name && price && url) {
            products.push({
              name,
              price,
              image: image.startsWith("//") ? `https:${image}` : image,
              url: url.startsWith("http") ? url : `https://nakpro.com${url}`,
              brand: "Nakpro",
              rating: 0,
              site: "Nakpro",
            });
          }
        } catch (e) {
          console.error("Error processing product:", e);
        }
      });
      return products;
    });
  } catch (error) {
    console.error("Error scraping Nakpro:", error);
    await page.screenshot({ path: "nakpro-error.png" });
    return [];
  }
}

// Utility function to add random delays
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Example usage of sleep
await sleep(Math.random() * 5000); // Random delay between 0 and 5 seconds
