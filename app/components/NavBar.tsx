import Link from "next/link";
import React from "react";
import { RiMenu3Fill } from "react-icons/ri";

export default function NavBar() {
  return (
    <div className=" w-full absolute top-0 flex justify-between z-10 px-4 py-2 md:px-12 md:py-4 lg:px-24 lg:py-6">
      <Link href="/">
        <div className=" text-2xl font-bold">Coffee Corner</div>
      </Link>
      <button className="flex flex-col justify-center items-center w-8 h-8 space-y-1 cursor-pointer text-2xl">
        <RiMenu3Fill />
      </button>
    </div>
  );
}
