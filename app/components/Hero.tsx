import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <div className=" w-full h-screen relative p-4 md:p-12 lg:p-24">
      <div className=" absolute top-0 left-0 w-full h-full">
        <Image
          src="/Hero.png"
          alt="hero-bg"
          fill
          className=" object-contain object-bottom"
        />
      </div>
    </div>
  );
}
