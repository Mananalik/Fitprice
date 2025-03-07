"use server"

import { scrapeProduct } from "../scraper";

export async function scrapeAndStoreProduct(category: string, weight: string, flavor: string){
    if (!category || !weight || !flavor) return;
    try{
        const scrapedProducts = await scrapeProduct(category, weight, flavor);
    } catch(error){
        if (error instanceof Error) {
            throw new Error(`Failed to create/update product: ${error.message}`);
        } else {
            throw new Error('Failed to create/update product: Unknown error');
        }
    }
}