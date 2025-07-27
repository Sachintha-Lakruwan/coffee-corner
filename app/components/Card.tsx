import React from "react";

interface CardProps {
  title: string;
  price: string;
  image: string;
}

export default function Card({ title, price, image }: CardProps) {
  return (
    <div className=" w-full h-full bg-white rounded-lg shadow-md">
      <h2 className=" text-2xl font-bold">{title}</h2>
      <p className=" text-sm text-gray-500">{price}</p>
    </div>
  );
}
