"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFacebookF,
  FaInstagram,
  FaRegBell,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";
import { MdOutlineOndemandVideo } from "react-icons/md";

type SubscribeStatus = "idle" | "success" | "error";

// Upcoming Vehicles Mock Data for Slider
const UPCOMING_VEHICLES_DATA = [
  {
    id: 1,
    title: "Tata Harrier EV",
    date: "Expected: Jun 2026",
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    title: "Honda Elevate 7-Seater",
    date: "Expected: Jul 2026",
    img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    title: "Royal Enfield Himalayan 750",
    date: "Expected: Aug 2026",
    img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    title: "Hyundai Ioniq 5 Facelift",
    date: "Expected: Sep 2026",
    img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 5,
    title: "Mahindra XUV.e9",
    date: "Expected: Oct 2026",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 6,
    title: "Bajaj Pulsar NS250",
    date: "Expected: Nov 2026",
    img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=400",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] =
    useState<SubscribeStatus>("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  // Slider controls (Shows 4 items at a time)
  const itemsPerPage = 4;
  const maxIndex = UPCOMING_VEHICLES_DATA.length - itemsPerPage;

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(maxIndex); // Go to end
    }
  };

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubscribing(true);
    setSubscribeStatus("idle");
    setSubscribeMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed.");
      }

      setSubscribeStatus("success");
      setSubscribeMessage(data.message || "Subscription successful.");
      setNewsletterEmail("");
    } catch (error) {
      setSubscribeStatus("error");
      setSubscribeMessage(
        error instanceof Error
          ? error.message
          : "Unable to subscribe right now.",
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <main className="bg-white min-h-screen text-zinc-900 select-none">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* =========================================================
            SECTION 1: HERO GRID SECTION
           ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* Main Featured News */}
          <div className="md:col-span-2 relative group cursor-pointer overflow-hidden rounded-md h-[450px]">
            <Image
              src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=1200"
              alt="Tata Safari"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-sm tracking-widest">
              Featured
            </span>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full text-white/50 hover:text-white transition-all">
              <FaChevronLeft size={18} />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full text-white/50 hover:text-white transition-all">
              <FaChevronRight size={18} />
            </button>
            <div className="absolute bottom-10 left-8 right-8">
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
                2025 Tata Safari Facelift Launched In India – Price, Features &
                All Details
              </h2>
              <div className="flex items-center gap-4 text-[11px] text-gray-300 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                  May 23, 2025
                </span>
                <span>By AutoPulse Team</span>
              </div>
            </div>
          </div>

          {/* Sidebar News Grid */}
          <div className="flex flex-col gap-4">
            <div className="relative flex-1 group cursor-pointer overflow-hidden rounded-md min-h-[217px]">
              <Image
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600"
                alt="Triumph News"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-sm tracking-widest">
                Bike News
              </span>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-black text-white leading-tight mb-1">
                  Triumph Street Triple 765 R Launched In India
                </h3>
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                  May 23, 2025
                </p>
              </div>
            </div>
            <div className="relative flex-1 group cursor-pointer overflow-hidden rounded-md min-h-[217px]">
              <Image
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600"
                alt="Mahindra News"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-sm tracking-widest">
                Car News upadte by rakat
              </span>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-black text-white leading-tight mb-1">
                  Mahindra BE 6e Booking Starts – Price, Range & More
                </h3>
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                  May 22, 2025
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            SECTION 2: LATEST NEWS, TRENDING & FOLLOW US
           ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LATEST NEWS */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="border-b border-zinc-200 pb-2 mb-4">
              <h2 className="text-sm font-black tracking-wider uppercase border-b-2 border-red-600 pb-2 -mb-[10px] inline-block text-zinc-900">
                Latest News
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-6 text-[10px] font-black tracking-wider uppercase">
              <span className="bg-red-600 text-white px-3 py-1.5 rounded-sm cursor-pointer">
                All
              </span>
              <span className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-3 py-1.5 rounded-sm cursor-pointer transition-colors">
                Car News
              </span>
              <span className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-3 py-1.5 rounded-sm cursor-pointer transition-colors">
                Bike News
              </span>
            </div>

            <div className="flex flex-col gap-6">
              {[
                {
                  title: "Hyundai Creta Electric Spotted Testing - Launch Soon",
                  tag: "Car News",
                  desc: "Hyundai Creta Electric has been spotted testing again, hinting at an early launch...",
                  img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
                },
                {
                  title: "2025 Yamaha R1 Officially Unveiled - Check Details",
                  tag: "Bike News",
                  desc: "Yamaha has taken the wraps off the 2025 R1 with huge updates in design...",
                  img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=400",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-5 gap-4 group cursor-pointer"
                >
                  <div className="col-span-2 relative h-24 rounded-sm overflow-hidden bg-zinc-100">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="col-span-3 flex flex-col justify-center">
                    <h3 className="text-sm font-extrabold leading-tight text-zinc-900 group-hover:text-red-500 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-1">
                      May 23, 2025 •{" "}
                      <span className="text-red-500">{item.tag}</span>
                    </p>
                    <p className="text-[11px] text-zinc-600 line-clamp-1 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 border border-zinc-200 bg-zinc-50 hover:bg-red-600 hover:text-white text-zinc-800 transition-colors text-[10px] font-black tracking-widest uppercase py-2.5 rounded-sm w-40">
              View More News
            </button>
          </div>

          {/* TRENDING NOW */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="border-b border-zinc-200 pb-2 mb-6">
              <h2 className="text-sm font-black tracking-wider uppercase border-b-2 border-red-600 pb-2 -mb-[10px] inline-block text-zinc-900">
                Trending Now
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              {[
                "Maruti eVX Electric SUV - Expected Price",
                "Bajaj Pulsar NS400Z Launched in India",
              ].map((title, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <span className="text-2xl font-black italic text-zinc-300 group-hover:text-red-600 transition-colors w-6">
                    0{idx + 1}
                  </span>
                  <div className="relative w-16 h-12 rounded-sm overflow-hidden bg-zinc-100 flex-shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=200"
                      alt="car"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="text-[12px] font-bold text-zinc-700 line-clamp-2 leading-snug group-hover:text-zinc-900 transition-colors">
                    {title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* FOLLOW US & VIDEOS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <div className="border-b border-zinc-200 pb-2 mb-4">
                <h2 className="text-sm font-black tracking-wider uppercase border-b-2 border-red-600 pb-2 -mb-[10px] inline-block text-zinc-900">
                  Follow Us
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-white">
                <div className="bg-[#3b5998] p-3 rounded-sm flex flex-col items-center cursor-pointer hover:opacity-90 transition-opacity">
                  <FaFacebookF size={12} />
                  <span className="text-[11px] font-black mt-1">125K</span>
                </div>
                <div className="bg-[#e1306c] p-3 rounded-sm flex flex-col items-center cursor-pointer hover:opacity-90 transition-opacity">
                  <FaInstagram size={12} />
                  <span className="text-[11px] font-black mt-1">78K</span>
                </div>
                <div className="bg-[#ff0000] p-3 rounded-sm flex flex-col items-center cursor-pointer hover:opacity-90 transition-opacity">
                  <FaYoutube size={12} />
                  <span className="text-[11px] font-black mt-1">235K</span>
                </div>
                <div className="bg-[#1da1f2] p-3 rounded-sm flex flex-col items-center cursor-pointer hover:opacity-90 transition-opacity">
                  <FaTwitter size={12} />
                  <span className="text-[11px] font-black mt-1">45K</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            SECTION 3: UPCOMING VEHICLES SLIDER
           ========================================================= */}
        <div className="mb-12 relative">
          <div className="border-b border-zinc-200 pb-2 mb-6 flex justify-between items-center">
            <h2 className="text-sm font-black tracking-wider uppercase border-b-2 border-red-600 pb-2 -mb-[10px] text-zinc-900">
              Upcoming Vehicles
            </h2>
            <Link
              href="/features"
              className="text-[10px] font-black tracking-widest text-red-600 hover:underline cursor-pointer uppercase"
            >
              View All &gt;
            </Link>
          </div>

          {/* Slider Container Row */}
          <div className="relative flex items-center group">
            {/* Left Control Arrow */}
            <button
              onClick={prevSlide}
              className="absolute -left-3 z-10 bg-white border border-zinc-200 text-zinc-700 p-2 rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-md"
            >
              <FaChevronLeft size={12} />
            </button>

            {/* Slider Cards Wrapper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full overflow-hidden">
              {UPCOMING_VEHICLES_DATA.slice(
                currentIndex,
                currentIndex + itemsPerPage,
              ).map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href="/features"
                  className="bg-[#fcfcfc] border border-zinc-200 rounded-sm overflow-hidden group/card cursor-pointer hover:border-zinc-300 transition-all flex flex-col shadow-sm"
                >
                  <div className="relative h-36 w-full bg-zinc-100">
                    <Image
                      src={vehicle.img}
                      alt={vehicle.title}
                      fill
                      className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-3 bg-white">
                    <h4 className="text-xs font-extrabold text-zinc-800 group-hover/card:text-red-500 transition-colors truncate">
                      {vehicle.title}
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                      {vehicle.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Right Control Arrow */}
            <button
              onClick={nextSlide}
              className="absolute -right-3 z-10 bg-white border border-zinc-200 text-zinc-700 p-2 rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-md"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 4: FOOTER BLOCK
         ========================================================= */}
      <footer className="w-full bg-[#f9f9f9] border-t border-zinc-200 text-zinc-600">
        {/* 4.1 Features Banner Strip */}
        <div className="w-full bg-white border-b border-zinc-200 py-6">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <IoSpeedometerOutline size={26} className="text-red-600" />
              <div>
                <h5 className="text-[11px] font-black text-zinc-800 uppercase tracking-wider">
                  Fast & Reliable
                </h5>
                <p className="text-[10px] text-zinc-400 font-medium">
                  Get the latest auto news as it happens.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <AiOutlineSafetyCertificate size={26} className="text-red-600" />
              <div>
                <h5 className="text-[11px] font-black text-zinc-800 uppercase tracking-wider">
                  Expert Reviews
                </h5>
                <p className="text-[10px] text-zinc-400 font-medium">
                  In-depth reviews by Industry experts.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <MdOutlineOndemandVideo size={26} className="text-red-600" />
              <div>
                <h5 className="text-[11px] font-black text-zinc-800 uppercase tracking-wider">
                  Videos & More
                </h5>
                <p className="text-[10px] text-zinc-400 font-medium">
                  Watch exclusive videos, walkarounds.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <FaRegBell size={24} className="text-red-600" />
              <div>
                <h5 className="text-[11px] font-black text-zinc-800 uppercase tracking-wider">
                  Upcoming Alerts
                </h5>
                <p className="text-[10px] text-zinc-400 font-medium">
                  Never miss a launch or variant update.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4.2 Main Links & Subscriptions Menu */}
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8 text-xs">
          {/* Column 1: Brand Info Block */}
          <div className="md:col-span-1.5 flex flex-col gap-3">
            <h3 className="text-xl font-black italic text-zinc-900 tracking-tight">
              Auto<span className="text-red-600">PULSE</span>
            </h3>
            <p className="text-zinc-500 font-medium leading-relaxed text-[11px]">
              AutoPulse is your one-stop destination for the latest car and bike
              news, reviews, comparisons and videos from India and around the
              world.
            </p>
            <div className="flex items-center gap-3 text-zinc-400 mt-2">
              <a href="#" className="hover:text-zinc-900 transition-colors">
                <FaFacebookF size={13} />
              </a>
              <a href="#" className="hover:text-zinc-900 transition-colors">
                <FaInstagram size={13} />
              </a>
              <a href="#" className="hover:text-zinc-900 transition-colors">
                <FaYoutube size={13} />
              </a>
              <a href="#" className="hover:text-zinc-900 transition-colors">
                <FaTwitter size={13} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-zinc-800 font-black uppercase tracking-wider text-[11px] mb-4">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5 font-bold text-zinc-500 text-[11px]">
              <li>
                <Link
                  href="/about"
                  className="hover:text-red-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-red-500 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-red-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-red-500 transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="hover:text-red-500 transition-colors"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-zinc-800 font-black uppercase tracking-wider text-[11px] mb-4">
              Categories
            </h4>
            <ul className="flex flex-col gap-2.5 font-bold text-zinc-500 text-[11px]">
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Car News
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Bike News
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Comparisons
                </a>
              </li>
              <li>
                <Link
                  href="/features"
                  className="hover:text-red-500 transition-colors"
                >
                  Upcoming Vehicles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Popular Brands */}
          <div>
            <h4 className="text-zinc-800 font-black uppercase tracking-wider text-[11px] mb-4">
              Popular Brands
            </h4>
            <ul className="flex flex-col gap-2.5 font-bold text-zinc-500 text-[11px]">
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Tata
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Mahindra
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Maruti Suzuki
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Hyundai
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Royal Enfield
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter Input */}
          <div className="md:col-span-1">
            <h4 className="text-zinc-800 font-black uppercase tracking-wider text-[11px] mb-4">
              Newsletter
            </h4>
            <p className="text-zinc-500 text-[11px] font-bold mb-3">
              Subscribe to get the latest updates straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex w-full max-sm grounded-sm overflow-hidden border border-zinc-200 focus-within:border-red-600 transition-all">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="bg-white text-zinc-800 px-3 py-2 w-full text-[11px] font-semibold outline-none placeholder-zinc-300"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-red-600 text-white font-black uppercase px-4 text-[10px] tracking-wider hover:bg-red-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubscribing ? "Sending" : "Subscribe"}
                </button>
              </div>
              {subscribeStatus !== "idle" && (
                <p
                  className={`text-[11px] font-bold ${
                    subscribeStatus === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {subscribeMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* 4.3 Copyright Row Bottom */}
        <div className="w-full border-t border-zinc-200/60 py-4 text-center text-[10px] font-bold text-zinc-400 bg-zinc-50">
          © 2026 AutoPulse. All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}
