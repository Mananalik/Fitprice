"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface Product {
  name: string;
  price: string;
  image: string;
  url: string;
  brand?: string;
  rating?: number;
  site: string;
}

export default function ResultsComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const product = searchParams.get("product");
  const weight = searchParams.get("weight");
  const flavor = searchParams.get("flavor");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<
    "relevance" | "price-asc" | "price-desc" | "rating" | "brand"
  >("relevance");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");

  // Rest of your existing component code...
  // (Keep all the useEffect, filtering logic, and JSX the same)
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
        (selectedBrand === "all" || item.site === selectedBrand) && // Filter by site
        (item.rating ?? 0) >= minRating
      );
    })
    .sort((a, b) => {
      if (sortOrder === "relevance") {
        // Provide default values if product, weight, or flavor is null
        const productName = product || "";
        const productWeight = weight || "";
        const productFlavor = flavor || "";

        // Calculate relevance score for product A
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const containsButter = productName.toLowerCase().includes("butter");

        const aScore =
          (aName.includes(productName.toLowerCase()) ? 1 : 0) +
          (aName.includes(productWeight.toLowerCase()) ? 1 : 0) +
          (aName.includes(productFlavor.toLowerCase()) ? 1 : 0) -
          (!containsButter && aName.includes("butter") ? 10 : 0); // Reduce score if butter appears but was not searched

        const bScore =
          (bName.includes(productName.toLowerCase()) ? 1 : 0) +
          (bName.includes(productWeight.toLowerCase()) ? 1 : 0) +
          (bName.includes(productFlavor.toLowerCase()) ? 1 : 0) -
          (!containsButter && bName.includes("butter") ? 10 : 0); // Reduce score if butter appears but was not searched

        // Sort by relevance score in descending order
        return bScore - aScore;
      }

      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));

      switch (sortOrder) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "brand":
          return (a.site ?? "").localeCompare(b.site ?? ""); // Sort by site
        default:
          return 0;
      }
    });
  return (
    <div className="w-full max-w-[90%] mx-auto mt-12 text-center p-6">
      {isLoading && (
        <div className="flex flex-col justify-center items-center">
          <div className="mt-5">
            <span className="text-2xl font-semibold">
              Please be patient with us as it may take some time to get the
              results
            </span>
          </div>
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-black m-10"></div>
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
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
            Search Results
          </h1>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">₹{minPrice}</span>
                <Slider
                  range
                  min={0}
                  max={5000} // Adjust max price as needed
                  value={[minPrice, maxPrice]}
                  onChange={(value: number | number[]) => {
                    if (Array.isArray(value)) {
                      setMinPrice(value[0]);
                      setMaxPrice(value[1]);
                    }
                  }}
                  trackStyle={[{ backgroundColor: "#000" }]}
                  handleStyle={[
                    { backgroundColor: "#000", borderColor: "#000" },
                    { backgroundColor: "#000", borderColor: "#000" },
                  ]}
                  railStyle={{ backgroundColor: "#ddd" }}
                />
                <span className="text-sm text-gray-600">₹{maxPrice}</span>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-600">Min: ₹{minPrice}</span>
                <span className="text-sm text-gray-600">Max: ₹{maxPrice}</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Site
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  console.log("Selected Brand:", e.target.value); // Debugging
                  setSelectedBrand(e.target.value);
                }}
                className="px-2 py-1 border border-gray-300 rounded-lg">
                <option value="all">All</option>
                <option value="Amazon">Amazon</option>
                <option value="MuscleBlaze">MuscleBlaze</option>
                <option value="Optimum Nutrition">Optimum Nutrition</option>
                <option value="Nutrabay">Nutrabay</option>
                <option value="MyProtein">MyProtein</option>
                <option value="Nakpro">Nakpro</option>
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
              onClick={() => setSortOrder("relevance")}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                sortOrder === "relevance"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              Sort by Relevance
            </button>
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
                  Price: ₹{item.price}
                </p>
                <img
                  src={
                    item.name.includes("Butter") && item.site === "MuscleBlaze"
                      ? "/assets/images/peanut-butter.png"
                      : item.image
                  }
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
