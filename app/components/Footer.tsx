import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <div className="px-4 md:px-12 lg:px-24 relative w-full h-[70vh]">
      <div className=" absolute w-full h-full bg-amber-200 top-0 left-0 z-10">
        <Image
          src="/Footer.jpg"
          alt="footer-bg"
          fill
          className=" object-cover object-bottom"
        />
      </div>
    </div>
  );
}
