"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaChevronDown,
  FaFacebookF,
  FaInstagram,
  FaMoon,
  FaSearch,
  FaSun,
  FaTimes,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

type NavigationCategory = {
  slug: string;
  title: string;
};

const fallbackCategories: NavigationCategory[] = [
  { slug: "car-news", title: "Car News" },
  { slug: "bike-news", title: "Bike News" },
  { slug: "reviews", title: "Reviews" },
  { slug: "comparisons", title: "Comparisons" },
  { slug: "upcoming-vehicles", title: "Upcoming Vehicles" },
  { slug: "videos", title: "Videos" },
  { slug: "features", title: "Features" },
];
const chevronCategories = new Set(["car-news", "bike-news", "reviews", "videos", "features"]);

export default function Navbar() {
  const pathname = usePathname();
  const [currentDate] = useState(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    return new Date().toLocaleDateString("en-US", options);
  });
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<NavigationCategory[]>([]);
  const categoryLinks = categories.length ? categories : fallbackCategories;

  const applyTheme = (enabled: boolean) => {
    document.documentElement.classList.toggle("dark", enabled);
    localStorage.setItem("theme", enabled ? "dark" : "light");
    setDarkMode(enabled);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = savedTheme ? savedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", enabled);
    requestAnimationFrame(() => setDarkMode(enabled));
  }, []);

  useEffect(() => {
    let active = true;

    fetch("/api/news")
      .then((response) => response.json() as Promise<{ categories?: NavigationCategory[] }>)
      .then((data) => {
        const validCategories = (data.categories ?? []).filter(
          (category) => category.slug && category.title,
        );
        if (active && validCategories.length) setCategories(validCategories);
      })
      .catch(() => {
        // Keep the fallback navigation available if the backend is unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="w-full bg-white text-zinc-900 font-sans border-b border-zinc-200 select-none transition-colors duration-200 dark:bg-zinc-950 dark:text-white dark:border-zinc-800">
      {/* 1. TOP BAR */}
      <div className="w-full bg-[#f9f9f9] border-b border-zinc-200 px-4 py-2 flex flex-wrap justify-between items-center text-xs text-zinc-600 transition-colors duration-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-zinc-400 text-[11px] md:text-xs font-semibold dark:text-zinc-500">
            {currentDate || "Saturday, May 30, 2026"}
          </span>
          <span className="bg-red-600 text-white font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-sm animate-pulse">
            Breaking News
          </span>
          <span className="text-[11px] md:text-xs text-zinc-800 font-bold truncate max-w-[250px] sm:max-w-md dark:text-zinc-200">
            Bajaj Pulsar NS400Z Launched in India at ₹1.85 Lakh
          </span>
        </div>

        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-500">
            <a href="#" className="hover:text-zinc-900 transition-colors dark:hover:text-white">
              <FaFacebookF size={12} />
            </a>
            <a href="#" className="hover:text-zinc-900 transition-colors dark:hover:text-white">
              <FaInstagram size={12} />
            </a>
            <a href="#" className="hover:text-zinc-900 transition-colors dark:hover:text-white">
              <FaTwitter size={12} />
            </a>
            <a href="#" className="hover:text-zinc-900 transition-colors dark:hover:text-white">
              <FaYoutube size={12} />
            </a>
          </div>

          <div className="h-4 w-[1px] bg-zinc-200 hidden sm:block dark:bg-zinc-800"></div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-500 font-bold dark:text-zinc-400">
              {darkMode ? "Dark Mode" : "Light Mode"}
            </span>
            <button
              type="button"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={darkMode}
              onClick={() => applyTheme(!darkMode)}
              className="relative flex h-5 w-10 items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-600/40"
              style={{ backgroundColor: darkMode ? "#dc2626" : "#e4e4e7" }}
            >
              <div
                className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] text-zinc-800 shadow-md transform transition-transform duration-300"
                style={{
                  transform: darkMode ? "translateX(20px)" : "translateX(0px)",
                }}
              >
                {darkMode ? <FaMoon size={9} /> : <FaSun size={9} />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-baseline relative">
            <Link
              href="/"
              className="text-3xl md:text-4xl font-black tracking-tight italic text-zinc-900 transition-colors dark:text-white"
            >
              Auto<span className="text-red-600">PULSE</span>
            </Link>
            <div className="absolute -top-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-60"></div>
          </div>
          <p className="text-[9px] md:text-[10px] text-zinc-400 tracking-widest font-bold uppercase mt-1 dark:text-zinc-500">
            CAR & BIKE NEWS, REVIEWS & MORE
          </p>
        </div>

        <div className="md:col-span-2 w-full flex justify-center md:justify-end">
          <div className="w-full max-w-[728px] h-[90px] bg-gradient-to-r from-[#f5f5f5] via-[#fafafa] to-[#f5f5f5] border border-zinc-200 rounded-md p-4 flex items-center justify-between overflow-hidden relative group hover:border-zinc-300 transition-all shadow-sm dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700">
            <div className="z-10 flex flex-col justify-center h-full">
              <span className="text-[8px] text-zinc-400 uppercase tracking-widest mb-0.5 font-bold">
                Sponsored Ad
              </span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-extrabold">
                THE ALL-NEW
              </p>
              <h3 className="text-xl font-black text-zinc-900 leading-tight tracking-wide dark:text-white">
                BMW X5
              </h3>
              <p className="text-[9px] text-zinc-400 tracking-tight font-semibold">
                BOLD. POWERFUL. UNSTOPPABLE.
              </p>
            </div>

            <div className="absolute right-28 top-1/2 -translate-y-1/2 w-[200px] h-[75px] z-10 transition-transform duration-500 group-hover:scale-105 hidden sm:block">
              <Image
                src="/bmw-x5.png"
                alt="BMW X5"
                width={200}
                height={75}
                className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
                priority
              />
            </div>

            <button className="bg-zinc-900 text-white font-black text-[11px] px-4 py-2 rounded-sm hover:bg-red-600 hover:text-white transition-all uppercase tracking-wider z-20 whitespace-nowrap shadow-sm dark:bg-white dark:text-zinc-950 dark:hover:bg-red-600 dark:hover:text-white">
              Know More
            </button>
          </div>
        </div>
      </div>

      {/* 3. NEW CATEGORY NAVIGATION BAR (Matching image_2e3d95.png) */}
      <nav className="w-full bg-[#fdfdfd] border-t border-b border-zinc-200 sticky top-0 z-50 shadow-sm transition-colors duration-200 dark:bg-zinc-950 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center md:hidden p-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-800 focus:outline-none hover:text-red-600 transition-colors dark:text-zinc-200"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <span className="ml-3 text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
              Menu
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center flex-1">
            <Link
              href="/"
              className="bg-red-600 text-white font-extrabold text-xs tracking-wider uppercase px-6 py-3.5 hover:bg-red-700 transition-colors"
            >
              Home
            </Link>

            <div className="flex items-center text-[11px] font-extrabold tracking-widest uppercase text-zinc-700 dark:text-zinc-300">
              {categoryLinks.map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className={`px-4 py-4 hover:bg-zinc-50 hover:text-red-600 transition-all flex items-center gap-1.5 dark:hover:bg-zinc-900 ${index < categoryLinks.length - 1 ? "border-r border-zinc-100 dark:border-zinc-800" : ""}`}
                >
                  {category.title}
                  {chevronCategories.has(category.slug) && <FaChevronDown size={9} className="text-zinc-400" />}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-4 flex items-center justify-center text-zinc-500 hover:text-red-600 cursor-pointer transition-colors border-l border-zinc-100 md:h-full dark:border-zinc-800 dark:text-zinc-400">
            <FaSearch size={14} />
          </div>

          {/* Mobile Dropdown Drawer */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-b border-zinc-200 flex flex-col md:hidden text-xs font-bold uppercase tracking-wider text-zinc-700 z-50 shadow-md dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-red-600 text-white"
              >
                Home
              </Link>
              {categoryLinks.map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 hover:bg-zinc-50 flex justify-between items-center dark:hover:bg-zinc-900 ${index < categoryLinks.length - 1 ? "border-b border-zinc-100 dark:border-zinc-800" : ""}`}
                >
                  {category.title}
                  {chevronCategories.has(category.slug) && <FaChevronDown size={10} />}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
