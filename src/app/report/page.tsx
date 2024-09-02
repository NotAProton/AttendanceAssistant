"use client";
import Image from "next/image";
import Footer from "../../lib/footer";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "https://forms.gle/ZZbuHwbz8u4cZ2aE6";
    }
  });
  return (
    <div className="min-h-screen flex flex-col">
      <header className="shadow-md py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Image
            src="/calendar.svg"
            alt="Calendar Logo"
            width={40}
            height={40}
            className="mr-4"
          />
          <h1 className="text-2xl font-bold">
            <span className="text-textc">Attendance</span>{" "}
            <span className="text-primary">Assistant</span>
          </h1>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex flex-grow bg-gradient-radial py-20 min-h-[80vh] justify-center items-center">
        <h2>Redirecting... </h2>
      </main>
      <Footer />
    </div>
  );
}
