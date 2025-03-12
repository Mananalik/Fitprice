"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Product {
  name: string;
  price: string;
  image: string;
  url: string;
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        {!isLoading && !error && results.length > 0
          ? results.map((item, index) => (
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
                  className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black  transition-all">
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
