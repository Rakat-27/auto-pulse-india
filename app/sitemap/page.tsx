"use client";

import Link from "next/link";
import { FaChevronRight, FaSitemap } from "react-icons/fa";

export default function Sitemap() {
  const sitemapData = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Disclaimer", href: "/disclaimer" },
      ],
    },
    {
      title: "Categories",
      links: [
        { name: "Car News", href: "#" },
        { name: "Bike News", href: "#" },
        { name: "Reviews", href: "#" },
        { name: "Comparisons", href: "#" },
        { name: "Upcoming Vehicles", href: "/features" },
      ],
    },
    {
      title: "Popular Brands",
      links: [
        { name: "Tata", href: "#" },
        { name: "Mahindra", href: "#" },
        { name: "Maruti Suzuki", href: "#" },
        { name: "Hyundai", href: "#" },
        { name: "Royal Enfield", href: "#" },
      ],
    },
  ];

  return (
    <main className="bg-white min-h-screen text-zinc-900 select-none py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="border-b border-zinc-200 pb-4 mb-8 flex items-center gap-3">
          <FaSitemap className="text-red-600 text-2xl" />
          <h1 className="text-2xl font-black uppercase tracking-wider text-zinc-900">
            Sitemap
          </h1>
        </div>

        <p className="text-zinc-600 text-sm font-medium mb-10 leading-relaxed">
          Welcome to the AutoPulse Sitemap. Use the structured overview below to
          easily navigate through our website&apos;s main sections, latest vehicle
          categories, and popular automobile brands.
        </p>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sitemapData.map((category, idx) => (
            <div
              key={idx}
              className="bg-[#fcfcfc] border border-zinc-200 rounded-sm p-6 shadow-sm"
            >
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800 border-b border-zinc-200 pb-2 mb-4">
                {category.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {category.links.map((link, lIdx) => (
                  <li key={lIdx} className="group flex items-center gap-2">
                    <FaChevronRight className="text-zinc-400 text-[10px] group-hover:text-red-500 transition-colors" />
                    <Link
                      href={link.href}
                      className="text-zinc-600 font-bold text-xs group-hover:text-red-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
