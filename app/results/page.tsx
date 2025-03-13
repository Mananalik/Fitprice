"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Product {
  name: string;
  price: string;
  image: string;
  url: string;
  brand?: string;
  rating?: number;
}

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const product = searchParams.get("product");
  const weight = searchParams.get("weight");
  const flavor = searchParams.get("flavor");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<"price-asc" | "price-desc" | "rating" | "brand">("price-asc");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000); // Adjust max price as needed
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");

  useEffect(() => {
    if (!product || !weight || !flavor) {
      setError("Invalid Search Parameters");
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(
          `/api/search?product=${product}&weight=${weight}&flavor=${flavor}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data: Product[] = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results", error);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [product, weight, flavor]);

  // Filter and sort results
  const filteredAndSortedResults = results
    .filter((item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
      return (
        price >= minPrice &&
        price <= maxPrice &&
        (selectedBrand === "all" || item.brand === selectedBrand) &&
        (item.rating ?? 0) >= minRating
      );
    })
    .sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));

      switch (sortOrder) {
        case "price-asc":
          return priceA - priceB; // Sort by price (low to high)
        case "price-desc":
          return priceB - priceA; // Sort by price (high to low)
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0); // Sort by rating (high to low)
        case "brand":
          return (a.brand ?? "").localeCompare(b.brand ?? ""); // Sort by brand (alphabetical order)
        default:
          return 0; // Default: no sorting
      }
    });

  return (
    <div className="w-full max-w-[90%] mx-auto mt-12 text-center p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
        Search Results
      </h1>

      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg">
          <p>{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-3 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all duration-200">
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <>
          {/* Price Range Filter */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                  className="w-24 px-2 py-1 border border-gray-300 rounded-lg"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                  className="w-24 px-2 py-1 border border-gray-300 rounded-lg"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-lg">
                <option value="all">All</option>
                <option value="Brand A">Brand A</option>
                <option value="Brand B">Brand B</option>
                {/* Add more brands dynamically if available */}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseInt(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-lg">
                <option value={0}>All</option>
                <option value={4}>4 Stars & Above</option>
                <option value={3}>3 Stars & Above</option>
              </select>
            </div>
          </div>

          {/* Sorting Options */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setSortOrder("price-asc")}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                sortOrder === "price-asc"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              Sort by Price (Low to High)
            </button>
            <button
              onClick={() => setSortOrder("price-desc")}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                sortOrder === "price-desc"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              Sort by Price (High to Low)
            </button>
            <button
              onClick={() => setSortOrder("rating")}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                sortOrder === "rating"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              Sort by Rating
            </button>
            <button
              onClick={() => setSortOrder("brand")}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                sortOrder === "brand"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              Sort by Brand
            </button>
          </div>
        </>
      )}

      {/* Display Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        {!isLoading && !error && filteredAndSortedResults.length > 0
          ? filteredAndSortedResults.map((item, index) => (
              <div
                key={index}
                className="relative bg-white bg-opacity-70 backdrop-blur-md border border-gray-300 rounded-2xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-xl">
                <h3 className="text-md font-semibold text-gray-900">
                  {item.name}
                </h3>
                <p className="text-lg text-gray-700 mt-2">
                  Price: {item.price}
                </p>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover mt-4 mx-auto rounded-lg shadow-md"
                />
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black transition-all">
                  Buy Now
                </a>
              </div>
            ))
          : !isLoading &&
            !error && (
              <p className="text-gray-600 text-lg">No results found.</p>
            )}
      </div>
    </div>
  );
}

export default Page;