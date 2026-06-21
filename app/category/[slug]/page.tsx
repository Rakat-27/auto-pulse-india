"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { FaChevronLeft, FaClock, FaFolderOpen, FaPlay, FaUser } from "react-icons/fa";
import { db } from "@/lib/firebase";

type Category = { title?: string; description?: string };
type Article = {
  id: string;
  title?: string;
  excerpt?: string;
  image?: string;
  author?: string;
  categorySlug?: string;
  status?: string;
  publishedAt?: string;
  videoUrl?: string;
};

function dateLabel(value?: string) {
  if (!value) return "Recently added";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function embeddedVideoUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "");
    const youtubeId = hostname === "youtu.be" ? url.pathname.slice(1) : hostname.endsWith("youtube.com") ? (url.searchParams.get("v") ?? url.pathname.match(/^\/embed\/([^/]+)/)?.[1]) : null;
    if (youtubeId) return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
    if (hostname === "player.vimeo.com" && /^\/video\/\d+$/.test(url.pathname)) return url.toString();
  } catch {
    return null;
  }
  return null;
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stopCategory = onValue(ref(db, `categories/${slug}`), (snapshot) => setCategory(snapshot.val() as Category | null));
    const contentCollection = slug === "videos" ? "videos" : "articles";
    const stopArticles = onValue(ref(db, contentCollection), (snapshot) => {
      const nextArticles = Object.entries(snapshot.val() ?? {})
        .map(([id, article]) => ({ id, ...(article as Omit<Article, "id">) }))
        .filter((article) => article.status !== "Draft" && (slug === "videos" || article.categorySlug === slug))
        .sort((a, b) => String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? "")));
      setArticles(nextArticles);
      setReady(true);
    });
    return () => { stopCategory(); stopArticles(); };
  }, [slug]);

  const title = category?.title ?? slug.replace(/-/g, " ");
  const description = category?.description ?? "Explore the latest automotive insights, specifications, and news curated for this segment.";
  if (!ready) return <main className="grid min-h-screen place-items-center bg-white text-sm font-semibold text-zinc-500">Loading category…</main>;

  return <main className="min-h-screen select-none bg-white px-4 py-12 text-zinc-900"><div className="mx-auto max-w-6xl"><Link href="/" className="mb-8 inline-flex cursor-pointer items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 transition-colors hover:text-red-500 hover:underline"><FaChevronLeft size={10} /> Back to Home</Link><div className="mb-10 flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-center"><div className="flex items-center gap-4"><div className="shrink-0 rounded-md bg-zinc-100 p-3 text-red-600"><FaFolderOpen size={32} /></div><div><span className="rounded-sm bg-red-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-red-600">AutoPulse Category</span><h1 className="mt-1 text-3xl font-black uppercase tracking-wider text-zinc-900">{title}</h1></div></div><p className="max-w-xl text-xs font-medium leading-relaxed text-zinc-500 md:text-right">{description}</p></div>{articles.length ? <div className="grid grid-cols-1 gap-8 md:grid-cols-2">{articles.map((article) => { const embedUrl = slug === "videos" ? embeddedVideoUrl(article.videoUrl) : null; return <article key={article.id} className="group flex flex-col justify-between overflow-hidden rounded-md border border-zinc-200 bg-[#fcfcfc] transition-all hover:shadow-md"><div className="relative h-56 w-full overflow-hidden bg-zinc-100 sm:h-64">{embedUrl ? <iframe src={embedUrl} title={article.title ?? "Video"} className="h-full w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : article.image ? <Image src={article.image} alt={article.title ?? "Article image"} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-sm font-semibold text-zinc-400">No image yet</div>}{article.videoUrl && !embedUrl && <a href={article.videoUrl} target="_blank" rel="noreferrer" aria-label={`Watch ${article.title ?? "video"}`} className="absolute inset-0 grid place-items-center bg-zinc-950/20 transition-colors group-hover:bg-zinc-950/35"><span className="grid h-14 w-14 place-items-center rounded-full bg-red-600 pl-1 text-white shadow-lg transition-transform group-hover:scale-110"><FaPlay size={18} /></span></a>}</div><div className="flex flex-1 flex-col justify-between p-6"><div><div className="mb-3 flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400"><span className="flex items-center gap-1"><FaUser size={10} className="text-red-600" /> {article.author ?? "AutoPulse Team"}</span><span className="flex items-center gap-1"><FaClock size={10} /> {dateLabel(article.publishedAt)}</span></div><h2 className="mb-3 text-base font-black uppercase tracking-wide leading-snug text-zinc-900 transition-colors group-hover:text-red-600">{article.title ?? "Untitled article"}</h2><p className="mb-4 text-xs font-medium leading-relaxed text-zinc-500">{article.excerpt ?? "Article details will be added soon."}</p>{article.videoUrl && !embedUrl && <a href={article.videoUrl} target="_blank" rel="noreferrer" className="inline-flex text-xs font-black uppercase tracking-widest text-red-600 hover:underline">Watch video</a>}</div></div></article>; })}</div> : <div className="rounded-md border border-zinc-200 bg-[#fcfcfc] p-12 text-center shadow-sm"><p className="text-sm font-bold uppercase tracking-wide text-zinc-500">No published entries found in <span className="text-red-600">{title}</span>.</p><p className="mx-auto mt-2 max-w-sm text-xs font-medium text-zinc-400">Add a published article in the admin panel and it will appear here automatically.</p></div>}</div></main>;
}
