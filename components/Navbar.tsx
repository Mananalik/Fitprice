"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/logo.svg"
            width={27}
            height={27}
            alt="logo"
          />
          <p className="nav-logo">
            Fit<span className="text-primary">Price</span>
          </p>
        </Link>

        <button
          className="bg-black text-white px-3 py-2 rounded-lg w-[10%] hover:bg-white hover:text-black hover:border-2 hover:border-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => router.push("/")}>
          Search
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
