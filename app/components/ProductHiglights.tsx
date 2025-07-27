"use client";

import React, { useEffect, useState } from "react";
import Card from "./Card";

export interface Product {
  _id: string;
  name: string;
  description: string;
  richDescription: string;
  image: string;
  images: string[];
  brand: string;
  price: number;
  category: string;
  countInStock: number;
  rating: number;
  isFeatured: boolean;
  dateCreated: string;
  id: string;
}

interface ProductHiglightsProps {
  title: string;
  limit: number;
  url: string;
}

export default function ProductHiglights({
  title,
  limit,
  url,
}: ProductHiglightsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiHost)
          throw new Error("API host is not defined in environment variables");
        const res = await fetch(`${apiHost}${apiUrl}${url}?limit=${limit}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [limit, url]);

  return (
    <div className=" w-full p-4 md:p-12 lg:p-24">
      <h1 className=" text-6xl font-bold text-center mb-10">{title}</h1>
      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product._id}
            title={product.name}
            image={product.image}
            price={product.price}
          />
        ))}
      </ul>
    </div>
  );
}
