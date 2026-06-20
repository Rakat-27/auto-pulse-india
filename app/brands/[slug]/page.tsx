"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { FaArrowLeft, FaCarSide, FaMotorcycle } from "react-icons/fa";
import { db } from "@/lib/firebase";

type Brand = { name: string; description?: string };
type Product = {
  id: string;
  name?: string;
  brand?: string;
  type?: string;
  price?: number;
  status?: string;
  image?: string;
  description?: string;
};

function brandSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BrandPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [vehicles, setVehicles] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stopBrand = onValue(ref(db, `brands/${slug}`), (snapshot) => {
      setBrand(snapshot.val() as Brand | null);
    });
    const stopProducts = onValue(ref(db, "products"), (snapshot) => {
      const nextVehicles = Object.entries(snapshot.val() ?? {})
        .map(([id, product]) => ({ id, ...(product as Omit<Product, "id">) }))
        .filter((product) => product.status === "Published" && brandSlug(product.brand ?? "") === slug);
      setVehicles(nextVehicles);
      setReady(true);
    });

    return () => { stopBrand(); stopProducts(); };
  }, [slug]);

  const displayBrand = brand ?? (vehicles[0]?.brand ? { name: vehicles[0].brand } : null);
  if (!ready) return <main className="grid min-h-screen place-items-center bg-white text-sm font-semibold text-zinc-500">Loading vehicles…</main>;
  if (!displayBrand) return <main className="grid min-h-screen place-items-center bg-white p-6 text-center"><div><h1 className="text-2xl font-black">Brand not found</h1><Link href="/" className="mt-4 inline-block text-sm font-bold text-red-600">Back to home</Link></div></main>;

  return <main className="min-h-screen bg-white px-4 py-12 text-zinc-900"><div className="mx-auto max-w-6xl"><Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-500"><FaArrowLeft size={11} /> Back to home</Link><header className="mt-7 border-b border-zinc-200 pb-7"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-600">Vehicle brand</p><h1 className="mt-2 text-3xl font-black uppercase tracking-wide sm:text-4xl">{displayBrand.name} Vehicles</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">{displayBrand.description ?? `Explore the latest ${displayBrand.name} vehicles, images, prices, and key details.`}</p></header>{vehicles.length ? <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{vehicles.map((vehicle) => <article key={vehicle.id} className="overflow-hidden rounded-md border border-zinc-200 bg-[#fcfcfc] shadow-sm transition-shadow hover:shadow-md"><div className="relative h-52 bg-zinc-100">{vehicle.image ? <Image src={vehicle.image} alt={vehicle.name ?? displayBrand.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" /> : <div className="grid h-full place-items-center text-zinc-400"><FaCarSide size={38} /></div>}</div><div className="p-5"><div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-600">{vehicle.type === "Bike" ? <FaMotorcycle /> : <FaCarSide />} {vehicle.type ?? "Vehicle"}</span><span className="text-sm font-black">{vehicle.price ? `₹${Number(vehicle.price).toLocaleString("en-IN")}` : "Price on request"}</span></div><h2 className="mt-3 text-lg font-black uppercase tracking-wide">{vehicle.name ?? "Untitled vehicle"}</h2><p className="mt-3 text-sm leading-6 text-zinc-500">{vehicle.description ?? "Vehicle details will be added soon."}</p></div></article>)}</div> : <div className="mt-9 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center"><p className="font-bold">No published {displayBrand.name} vehicles yet.</p><p className="mt-2 text-sm text-zinc-500">Vehicles added in the admin panel will appear here automatically.</p></div>}</div></main>;
}
