"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { onValue, ref, set } from "firebase/database";
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from "@/lib/realtime-compat";
import { FiArchive, FiBarChart2, FiBookOpen, FiCheckCircle, FiChevronRight, FiGrid, FiImage, FiInbox, FiLogOut, FiMenu, FiPlus, FiSearch, FiSettings, FiTag, FiTrash2, FiUsers, FiX } from "react-icons/fi";
import { auth, db } from "@/lib/firebase";
import { cloudinaryConfig, uploadProductImage } from "@/lib/cloudinary";

type Section = "dashboard" | "products" | "articles" | "categories" | "subscribers" | "messages" | "settings";
type Item = { id: string; [key: string]: unknown };
type Draft = { name: string; brand: string; type: string; price: string; status: string; stock: string; image: string; imagePublicId: string; description: string; featured: boolean };

const blank: Draft = { name: "", brand: "", type: "Car", price: "", status: "Published", stock: "1", image: "", imagePublicId: "", description: "", featured: false };
const nav: { id: Section; label: string; icon: ReactNode }[] = [
  { id: "dashboard", label: "Overview", icon: <FiGrid /> },
  { id: "products", label: "Products", icon: <FiArchive /> },
  { id: "articles", label: "Articles", icon: <FiBookOpen /> },
  { id: "categories", label: "Categories", icon: <FiTag /> },
  { id: "subscribers", label: "Subscribers", icon: <FiUsers /> },
  { id: "messages", label: "Messages", icon: <FiInbox /> },
  { id: "settings", label: "Setup", icon: <FiSettings /> },
];
const copy: Record<Section, [string, string]> = {
  dashboard: ["Good morning", "Here is what is happening with AutoPulse today."],
  products: ["Products", "Manage your vehicle inventory and Cloudinary images."],
  articles: ["Articles", "Publish and maintain editorial content."],
  categories: ["Categories", "Organize your editorial content."],
  subscribers: ["Subscribers", "Your newsletter audience in one place."],
  messages: ["Messages", "Review messages submitted through the contact page."],
  settings: ["Setup & security", "Check the services powering your console."],
};
const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");
const errorText = (value: unknown) => {
  const message = value instanceof Error ? value.message.replace("Firebase: ", "") : "Something went wrong.";
  if (message.includes("auth/configuration-not-found")) {
    return "Firebase Authentication is not configured. Enable Email/Password sign-in in the Firebase Console, then create the admin account.";
  }
  return message;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-slate-700">{label}</span>{children}</label>;
}

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      const result = (await response.json()) as {
        firebaseEmail?: string;
        error?: string;
      };

      if (!response.ok || !result.firebaseEmail) {
        throw new Error(result.error || "Unable to sign in.");
      }

      await signInWithEmailAndPassword(auth, result.firebaseEmail, password);
    } catch (reason) {
      setError(errorText(reason));
    } finally {
      setPending(false);
    }
  }

  return <main className="min-h-screen bg-[#f4f7fb] px-5 py-10 text-slate-900">
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
      <section className="relative hidden w-[52%] overflow-hidden bg-[#111827] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />
        <Link href="/" className="relative text-2xl font-black italic">Auto<span className="text-red-500">PULSE</span></Link>
        <div className="relative max-w-md"><span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">Private admin workspace</span><h1 className="mt-5 text-5xl font-bold leading-[1.08] tracking-tight">Everything you publish, in one calm place.</h1><p className="mt-5 leading-7 text-slate-400">One fixed administrator account controls inventory, content, subscribers, and messages.</p></div>
        <p className="relative text-xs text-slate-500">AutoPulse India · Editorial OS</p>
      </section>
      <section className="flex flex-1 items-center justify-center p-7 sm:p-12"><div className="w-full max-w-sm">
        <Link href="/" className="mb-9 block text-xl font-black italic lg:hidden">Auto<span className="text-red-600">PULSE</span></Link>
        <p className="text-sm font-semibold text-red-600">Private access</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Sign in to admin</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">Enter the fixed administrator credentials configured in your environment.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field label="Admin user ID"><input className="admin-input" required autoComplete="username" value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="Admin ID" /></Field>
          <Field label="Password"><input className="admin-input" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" /></Field>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={pending} className="w-full rounded-xl bg-red-600 px-4 py-3.5 text-sm font-bold text-white disabled:opacity-60">{pending ? "Please wait…" : "Sign in"}</button>
        </form>
      </div></section>
    </div>
  </main>;
}
export default function AdminClient() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [section, setSection] = useState<Section>("dashboard");
  const [menu, setMenu] = useState(false);
  const [data, setData] = useState<Record<string, Item[]>>({ products: [], articles: [], categories: [], subscribers: [], messages: [] });
  const [dataError, setDataError] = useState("");

  useEffect(() => onAuthStateChanged(auth, async (next) => {
    setUser(next); setReady(true);
    if (!next) { setAllowed(null); return; }
    setAllowed(next.email === process.env.NEXT_PUBLIC_ADMIN_FIREBASE_EMAIL);
  }), []);

  useEffect(() => {
    if (!user || !allowed) return;
    const names = ["products", "articles", "categories", "subscribers", "messages"];
    const stops = names.map((name) => onSnapshot(collection(db, name), (snap) => {
      const rows = snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
      setData((old) => ({ ...old, [name]: rows })); setDataError("");
    }, (reason) => setDataError(errorText(reason))));
    return () => stops.forEach((stop) => stop());
  }, [user, allowed]);

  if (!ready || (user && allowed === null)) return <main className="grid min-h-screen place-items-center bg-[#f4f7fb]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" /></main>;
  if (!user) return <Login />;
  if (!allowed) return <main className="grid min-h-screen place-items-center bg-[#f4f7fb] p-6"><div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-9 text-center shadow-xl"><FiSettings className="mx-auto text-3xl text-amber-600" /><h1 className="mt-5 text-2xl font-bold">Account not authorized</h1><p className="mt-3 text-sm leading-6 text-slate-500">This Firebase account does not match the fixed admin email configured in .env.</p><button onClick={() => signOut(auth)} className="mt-7 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">Back to sign in</button></div></main>;

  return <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
    <aside className={cx("fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#111827] px-4 py-6 text-white transition-transform lg:translate-x-0", menu ? "translate-x-0" : "-translate-x-full")}>
      <div className="flex items-center justify-between px-3"><Link href="/" className="text-xl font-black italic">Auto<span className="text-red-500">PULSE</span></Link><button className="lg:hidden" onClick={() => setMenu(false)}><FiX /></button></div><p className="mt-1 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">Admin console</p>
      <nav className="mt-9 space-y-1">{nav.map((item) => <button key={item.id} onClick={() => { setSection(item.id); setMenu(false); }} className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition", section === item.id ? "bg-red-600 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white")}><span className="text-lg">{item.icon}</span>{item.label}{section === item.id && <FiChevronRight className="ml-auto" />}</button>)}</nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-3"><p className="truncate text-xs font-semibold text-slate-300">{user.email}</p><button onClick={() => signOut(auth)} className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white"><FiLogOut /> Sign out</button></div>
    </aside>
    {menu && <button aria-label="Close menu" onClick={() => setMenu(false)} className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" />}
    <div className="lg:pl-64">
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur md:px-8"><div className="flex items-center gap-4"><button onClick={() => setMenu(true)} className="grid h-10 w-10 place-items-center rounded-xl border lg:hidden"><FiMenu /></button><div><h1 className="text-xl font-bold tracking-tight">{copy[section][0]}{section === "dashboard" ? ", " + (user.email || "admin").split("@")[0] : ""}</h1><p className="hidden text-xs text-slate-500 sm:block">{copy[section][1]}</p></div></div><Link href="/" target="_blank" className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold">View website</Link></header>
      <div className="p-5 md:p-8">{dataError && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{dataError}</p>}{section === "dashboard" && <Dashboard data={data} go={setSection} />}{section === "products" && <Products items={data.products} />}{section === "articles" && <Manager collectionName="articles" singular="article" items={data.articles} fields={["title", "excerpt", "author", "categorySlug", "image", "status"]} />}{section === "categories" && <Manager collectionName="categories" singular="category" items={data.categories} fields={["title", "slug", "description"]} />}{section === "subscribers" && <Inbox type="subscriber" items={data.subscribers} />}{section === "messages" && <Inbox type="message" items={data.messages} />}{section === "settings" && <Setup user={user} />}</div>
    </div>
  </main>;
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-bold">{title}</h2>{action}</div><div className="p-5">{children}</div></section>;
}
function Empty({ text }: { text: string }) { return <div className="grid min-h-44 place-items-center p-8 text-center"><div><FiBarChart2 className="mx-auto text-2xl text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-500">{text}</p></div></div>; }
function ProductList({ items }: { items: Item[] }) {
  if (!items.length) return <Empty text="No products yet. Add your first vehicle." />;
  return <div className="divide-y divide-slate-100">{items.map((item) => <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"><div className="h-12 w-16 shrink-0 rounded-lg bg-slate-100 bg-cover bg-center" style={item.image ? { backgroundImage: 'url("' + String(item.image) + '")' } : undefined} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{String(item.name || "Untitled product")}</p><p className="mt-1 text-xs text-slate-500">{String(item.brand || "No brand")} · {String(item.type || "Vehicle")}</p></div><p className="text-sm font-bold">{item.price ? "₹" + Number(item.price).toLocaleString("en-IN") : "—"}</p></div>)}</div>;
}

function Dashboard({ data, go }: { data: Record<string, Item[]>; go: (section: Section) => void }) {
  const stats = [["Total products", data.products.length, <FiArchive key="a" />, "bg-blue-50 text-blue-600"], ["Published articles", data.articles.length, <FiBookOpen key="b" />, "bg-violet-50 text-violet-600"], ["Subscribers", data.subscribers.length, <FiUsers key="c" />, "bg-emerald-50 text-emerald-600"], ["Unread messages", data.messages.filter((item) => item.status !== "read").length, <FiInbox key="d" />, "bg-orange-50 text-orange-600"]];
  return <><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <div key={String(stat[0])} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex justify-between"><div><p className="text-xs font-semibold text-slate-500">{stat[0] as string}</p><p className="mt-3 text-3xl font-bold">{stat[1] as number}</p></div><div className={cx("grid h-11 w-11 place-items-center rounded-xl text-xl", stat[3] as string)}>{stat[2] as ReactNode}</div></div><p className="mt-5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><FiCheckCircle /> Live from Realtime Database</p></div>)}</div><div className="mt-7 grid gap-7 xl:grid-cols-[1.4fr_1fr]"><Panel title="Recently added products" action={<button onClick={() => go("products")} className="text-xs font-bold text-red-600">Manage all</button>}><ProductList items={data.products.slice(0, 5)} /></Panel><Panel title="Quick actions"><div className="grid grid-cols-2 gap-3">{nav.slice(1, 5).map((item) => <button key={item.id} onClick={() => go(item.id)} className="flex min-h-28 flex-col justify-between rounded-2xl border bg-slate-50 p-4 text-left hover:bg-red-50"><span className="text-xl text-slate-500">{item.icon}</span><span className="text-sm font-bold">{item.label}</span></button>)}</div></Panel></div></>;
}

function Products({ items }: { items: Item[] }) {
  const [draft, setDraft] = useState<Draft>(blank);
  const [editing, setEditing] = useState("");
  const [dialog, setDialog] = useState(false);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const filtered = useMemo(() => items.filter((item) => (String(item.name) + " " + String(item.brand)).toLowerCase().includes(search.toLowerCase())), [items, search]);

  function open(item?: Item) {
    setEditing(item?.id || "");
    setError("");
    setDraft(item ? { name: String(item.name || ""), brand: String(item.brand || ""), type: String(item.type || "Car"), price: String(item.price || ""), status: String(item.status || "Published"), stock: String(item.stock ?? "1"), image: String(item.image || ""), imagePublicId: String(item.imagePublicId || ""), description: String(item.description || ""), featured: Boolean(item.featured) } : blank);
    setDialog(true);
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try { const value = { ...draft, price: Number(draft.price), stock: Number(draft.stock), updatedAt: serverTimestamp() }; if (editing) await updateDoc(doc(db, "products", editing), value); else await addDoc(collection(db, "products"), { ...value, createdAt: serverTimestamp() }); setDialog(false); } catch (reason) { setError(errorText(reason)); } finally { setBusy(false); }
  }

  async function upload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) { setError("Choose an image smaller than 8 MB."); return; }
    setBusy(true);
    try { const result = await uploadProductImage(file); setDraft((old) => ({ ...old, image: result.secureUrl, imagePublicId: result.publicId })); } catch (reason) { setError(errorText(reason)); } finally { setBusy(false); }
  }

  return <><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between"><div className="relative max-w-md flex-1"><FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input className="admin-input pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" /></div><button onClick={() => open()} className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white"><FiPlus /> Add product</button></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{filtered.length ? <div className="divide-y divide-slate-100">{filtered.map((item) => <div key={item.id} className="flex items-center gap-4 p-5"><div className="h-14 w-20 shrink-0 rounded-lg bg-slate-100 bg-cover bg-center" style={item.image ? { backgroundImage: `url('${String(item.image)}')` } : undefined} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{String(item.name || "Untitled product")}</p><p className="mt-1 text-xs text-slate-500">{String(item.brand || "No brand")} · {String(item.type || "Vehicle")}</p><p className="mt-2 text-xs font-semibold text-slate-400">{String(item.status || "Draft")}</p></div><p className="hidden text-sm font-bold sm:block">{item.price ? `₹${Number(item.price).toLocaleString("en-IN")}` : "—"}</p><div className="flex shrink-0 items-center gap-2"><button onClick={() => open(item)} className="rounded-lg px-3 py-2 text-xs font-bold hover:bg-slate-100">Edit</button><button aria-label={`Delete ${String(item.name || "product")}`} onClick={() => window.confirm("Delete this product?") && deleteDoc(doc(db, "products", item.id))} className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50"><FiTrash2 /></button></div></div>)}</div> : <Empty text="No products match your search." />}</div>{dialog && <Modal title={editing ? "Edit product" : "Add product"} close={() => setDialog(false)}><form onSubmit={save} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Product name"><input required className="admin-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field><Field label="Brand"><input required className="admin-input" value={draft.brand} onChange={(e) => setDraft({ ...draft, brand: e.target.value })} /></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Type"><select className="admin-input" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}><option>Car</option><option>Bike</option><option>EV</option><option>Accessory</option></select></Field><Field label="Status"><select className="admin-input" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option>Published</option><option>Draft</option><option>Archived</option></select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Price (₹)"><input required type="number" min="0" className="admin-input" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} /></Field><Field label="Stock"><input type="number" min="0" className="admin-input" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} /></Field></div><Field label="Description"><textarea rows={3} className="admin-input resize-none" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field><Field label="Product image"><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed bg-slate-50 p-5 text-sm font-bold"><FiImage /> Upload to Cloudinary<input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} /></label><input className="admin-input mt-3" value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="Or paste image URL" /></Field><label className="flex gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} /> Feature this product</label>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="flex justify-end gap-3 pt-3"><button type="button" onClick={() => setDialog(false)} className="px-4 py-3 text-sm font-bold text-slate-500">Cancel</button><button disabled={busy} className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{busy ? "Working…" : "Save product"}</button></div></form></Modal>}</>;
}

function Manager({ collectionName, singular, items, fields }: { collectionName: string; singular: string; items: Item[]; fields: string[] }) {
  const [dialog, setDialog] = useState(false); const [editing, setEditing] = useState(""); const [values, setValues] = useState<Record<string, string>>({}); const [error, setError] = useState(""); const [uploading, setUploading] = useState(false);
  function open(item?: Item) { setEditing(item?.id || ""); setValues(Object.fromEntries(fields.map((field) => [field, String(item?.[field] || (field === "status" ? "Published" : ""))]))); setDialog(true); setError(""); }
  async function save(event: FormEvent) { event.preventDefault(); try { const value = { ...values, updatedAt: serverTimestamp(), ...(collectionName === "articles" ? { publishedAt: new Date().toISOString() } : {}) }; if (editing) await updateDoc(doc(db, collectionName, editing), value); else await addDoc(collection(db, collectionName), { ...value, createdAt: serverTimestamp() }); setDialog(false); } catch (reason) { setError(errorText(reason)); } }
  async function upload(file?: File) { if (!file) return; if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) { setError("Choose an image smaller than 8 MB."); return; } setUploading(true); setError(""); try { const result = await uploadProductImage(file); setValues((old) => ({ ...old, image: result.secureUrl })); } catch (reason) { setError(errorText(reason)); } finally { setUploading(false); } }
  return <><div className="mb-6 flex justify-end"><button onClick={() => open()} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white"><FiPlus /> Add {singular}</button></div><div className="overflow-hidden rounded-2xl border bg-white shadow-sm">{items.length ? <div className="divide-y">{items.map((item) => <div key={item.id} className="flex items-center gap-4 p-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">{singular === "article" ? <FiBookOpen /> : <FiTag />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{String(item.title || "Untitled")}</p><p className="truncate text-xs text-slate-500">{String(item.description || item.excerpt || item.slug || "")}</p></div><button onClick={() => open(item)} className="px-3 py-2 text-xs font-bold">Edit</button><button onClick={() => window.confirm("Delete this entry?") && deleteDoc(doc(db, collectionName, item.id))} className="text-red-500"><FiTrash2 /></button></div>)}</div> : <Empty text={"No " + singular + "s yet."} />}</div>{dialog && <Modal title={(editing ? "Edit " : "Add ") + singular} close={() => setDialog(false)}><form onSubmit={save} className="space-y-4">{fields.map((field) => <Field key={field} label={field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}>{field === "description" || field === "excerpt" ? <textarea rows={3} className="admin-input resize-none" value={values[field] || ""} onChange={(e) => setValues({ ...values, [field]: e.target.value })} /> : field === "image" && collectionName === "articles" ? <><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed bg-slate-50 p-4 text-sm font-bold"><FiImage /> {uploading ? "Uploading image…" : "Upload from PC to Cloudinary"}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => upload(e.target.files?.[0])} /></label><input className="admin-input mt-3" value={values[field] || ""} onChange={(e) => setValues({ ...values, [field]: e.target.value })} placeholder="Or paste image URL" /></> : <input required={field === "title" || field === "slug"} className="admin-input" value={values[field] || ""} onChange={(e) => setValues({ ...values, [field]: e.target.value })} />}</Field>)}{error && <p className="text-sm text-red-600">{error}</p>}<div className="flex justify-end"><button disabled={uploading} className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">Save {singular}</button></div></form></Modal>}</>;
}

function Inbox({ type, items }: { type: "subscriber" | "message"; items: Item[] }) {
  const name = type === "message" ? "messages" : "subscribers";
  return <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">{items.length ? <div className="divide-y">{items.map((item) => <div key={item.id} className="flex items-start gap-4 p-5"><div className={cx("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", type === "message" && item.status !== "read" ? "bg-red-500" : "bg-slate-300")} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{String(item.name || item.email || "Anonymous")}</p>{type === "message" && <><p className="mt-1 text-xs font-semibold">{String(item.subject || "No subject")}</p><p className="mt-2 text-sm leading-6 text-slate-500">{String(item.message || "")}</p></>}<p className="mt-2 text-[11px] text-slate-400">{String(item.email || "")}</p></div>{type === "message" && item.status !== "read" && <button onClick={() => updateDoc(doc(db, name, item.id), { status: "read" })} className="px-3 py-2 text-xs font-bold">Mark read</button>}<button onClick={() => window.confirm("Delete this entry?") && deleteDoc(doc(db, name, item.id))} className="text-red-500"><FiTrash2 /></button></div>)}</div> : <Empty text={type === "message" ? "Your inbox is clear." : "No subscribers yet."} />}</div>;
}

function Setup({ user }: { user: User }) {
  const [contact, setContact] = useState({ phone: "", email: "", location: "" });
  const [savingContact, setSavingContact] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  useEffect(() => onValue(ref(db, "siteSettings/contact"), (snapshot) => {
    const value = snapshot.val() as { phone?: string; email?: string; location?: string } | null;
    if (value) setContact({ phone: value.phone ?? "", email: value.email ?? "", location: value.location ?? "" });
  }), []);
  async function saveContact(event: FormEvent) { event.preventDefault(); setSavingContact(true); setContactMessage(""); try { await set(ref(db, "siteSettings/contact"), contact); setContactMessage("Contact details saved. The public contact page updates instantly."); } catch (reason) { setContactMessage(errorText(reason)); } finally { setSavingContact(false); } }
  const checks: [string, boolean, string][] = [
    ["Firebase database", true, "Realtime Database and Authentication"],
    ["Cloudinary cloud", Boolean(cloudinaryConfig.cloudName), "Image delivery account"],
    ["Unsigned upload preset", Boolean(cloudinaryConfig.uploadPreset), "Browser image uploads"],
    ["Fixed admin account", true, user.email || "Not signed in"],
  ];

  return <div className="grid gap-6 xl:grid-cols-2"><Panel title="Service status"><div className="space-y-3">{checks.map(([label, ok, detail]) => <div key={label} className="flex items-center gap-3 rounded-xl border p-4"><div className={cx("grid h-9 w-9 place-items-center rounded-full", ok ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>{ok ? <FiCheckCircle /> : <FiSettings />}</div><div><p className="text-sm font-bold">{label}</p><p className="break-all text-xs text-slate-500">{detail}</p></div><span className={cx("ml-auto text-[10px] font-bold uppercase", ok ? "text-emerald-600" : "text-amber-600")}>{ok ? "Ready" : "Needs setup"}</span></div>)}</div></Panel><Panel title="Finish setup"><ol className="list-decimal space-y-4 pl-5 text-sm leading-6 text-slate-600"><li>Email/Password sign-in and the admin account are ready.</li><li>Deploy <b>database.rules.json</b> to protect your Realtime Database.</li><li>For product image upload, create a Cloudinary unsigned upload preset restricted to images.</li><li>Add <b>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</b> and <b>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</b> to <b>.env.local</b>, then restart Next.js.</li></ol></Panel><Panel title="Public contact details"><form onSubmit={saveContact} className="space-y-4"><Field label="Phone"><input required className="admin-input" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></Field><Field label="Email"><input required type="email" className="admin-input" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></Field><Field label="Location"><input required className="admin-input" value={contact.location} onChange={(e) => setContact({ ...contact, location: e.target.value })} /></Field>{contactMessage && <p className="text-sm text-slate-600">{contactMessage}</p>}<button disabled={savingContact} className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{savingContact ? "Saving…" : "Save contact details"}</button></form></Panel></div>;
}
function Modal({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm"><div className="my-8 w-full max-w-2xl rounded-3xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b px-6 py-5"><h2 className="text-lg font-bold">{title}</h2><button onClick={close} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-slate-100"><FiX /></button></div><div className="max-h-[75vh] overflow-y-auto p-6">{children}</div></div></div>;
}
