import Image from "next/image";
import React from "react";
import { ArrowUpRight } from "lucide-react";

interface CardProps {
  title: string;
  price: number;
  image: string;
}

export default function Card({ title, image, price }: CardProps) {
  return (
    <li className=" w-full">
      <div className=" w-full aspect-[4/5] relative rounded-2xl overflow-hidden bg-neutral-200">
        <Image
          src={`/products/${image}`}
          alt={title}
          fill
          className=" object-cover"
        />
      </div>
      <div className=" flex flex-col gap-2 mt-3">
        <h4 className=" text-xl font-bold">{image}</h4>
        <p className=" text-sm text-gray-500 italic">${price}</p>
        <p className=" text-amber-500 text-xl mt-3 flex flex-row gap-2 items-cente">
          Buy
          <span>
            <ArrowUpRight />
          </span>
        </p>
      </div>
    </li>
  );
}
