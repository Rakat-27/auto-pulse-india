"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaChevronLeft, FaFolderOpen, FaClock, FaUser } from "react-icons/fa";
import { categoryDetailsData } from "@/lib/news";

export default function CategoryPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  // যদি ম্যাপিং ডেটা খুঁজে পাওয়া যায়, তবে তা এসাইন হবে; অন্যথায় একটি ফলব্যাক ডেটা শো করবে।
  const currentCategory = categoryDetailsData[slug] || {
    title: slug.replace(/-/g, " "),
    description:
      "Explore the latest automotive insights, specifications, and news curated specifically for this segment.",
    articles: [],
  };

  return (
    <main className="bg-white min-h-screen text-zinc-900 select-none py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* BACK TO HOME BUTTON */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-red-600 hover:text-red-500 hover:underline mb-8 transition-colors cursor-pointer"
        >
          <FaChevronLeft size={10} /> Back to Home
        </Link>

        {/* Category Header */}
        <div className="border-b border-zinc-200 pb-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-zinc-100 p-3 rounded-md text-red-600 shrink-0">
              <FaFolderOpen size={32} />
            </div>
            <div>
              <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-sm font-extrabold uppercase tracking-widest">
                AutoPulse Category
              </span>
              <h1 className="text-3xl font-black uppercase tracking-wider text-zinc-900 mt-1">
                {currentCategory.title}
              </h1>
            </div>
          </div>
          {/* Section Dynamic Long Description */}
          <p className="text-xs text-zinc-500 font-medium max-w-xl md:text-right leading-relaxed">
            {currentCategory.description}
          </p>
        </div>

        {/* Articles & Details Grid Section */}
        {currentCategory.articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentCategory.articles.map((article) => (
              <article
                key={article.id}
                className="bg-[#fcfcfc] border border-zinc-200 rounded-md overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                {/* News Image */}
                <div className="relative w-full h-56 sm:h-64 bg-zinc-100 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* News Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-3">
                      <span className="flex items-center gap-1">
                        <FaUser size={10} className="text-red-600" />{" "}
                        {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock size={10} className="text-zinc-400" />{" "}
                        {article.date}
                      </span>
                    </div>

                    <h2 className="text-base font-black text-zinc-900 uppercase tracking-wide group-hover:text-red-600 transition-colors mb-3 leading-snug">
                      {article.title}
                    </h2>

                    <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <Link
                    href="#"
                    className="inline-block border border-zinc-900 text-zinc-900 text-center font-black text-[10px] uppercase tracking-widest py-2 px-4 rounded-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all mt-2"
                  >
                    Read Full Story
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty/Fallback State */
          <div className="bg-[#fcfcfc] border border-zinc-200 rounded-md p-12 text-center shadow-sm">
            <p className="text-zinc-500 font-bold text-sm uppercase tracking-wide">
              No recent entries found in{" "}
              <span className="text-red-600">{currentCategory.title}</span>.
            </p>
            <p className="text-xs text-zinc-400 font-medium mt-2 max-w-sm mx-auto">
              Our auto journalists are currently working on live updates. Check
              back shortly.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
