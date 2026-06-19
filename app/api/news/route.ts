import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim();
    const search = searchParams.get("search")?.trim().toLowerCase();
    const limitParam = searchParams.get("limit");
    const limitNum = limitParam ? Number.parseInt(limitParam, 10) : undefined;

    // ১. ফায়ারস্টোর থেকে সব ক্যাটেগরি নিয়ে আসা (মেটাডেটার জন্য)
    const categoriesRef = collection(db, "categories");
    const categoriesSnapshot = await getDocs(categoriesRef);

    const categoriesList = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // ক্যাটেগরি ভ্যালিডেশন (যদি রিকোয়েস্টে কোনো ক্যাটেগরি স্লাগ থাকে)
    if (category && !categoriesList.some((c) => c.slug === category)) {
      return Response.json(
        { error: `Unknown category: ${category}` },
        { status: 404 },
      );
    }

    // ২. ফায়ারস্টোর থেকে আর্টিকেল কুয়েরি বিল্ড করা
    const articlesRef = collection(db, "articles");
    let articlesQuery = query(articlesRef, orderBy("publishedAt", "desc")); // লেটেস্ট নিউজ আগে দেখাবে

    // যদি নির্দিষ্ট ক্যাটেগরি ফিল্টার থাকে
    if (category) {
      articlesQuery = query(
        articlesRef,
        where("categorySlug", "==", category),
        orderBy("publishedAt", "desc"),
      );
    }

    const articlesSnapshot = await getDocs(articlesQuery);
    let articles = articlesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // ৩. সার্চ ফিল্টারিং (ফায়ারস্টোরে ফুল-টেক্সট সার্চ নেটিভলি না থাকায় ক্লায়েন্ট/সার্ভার সাইডে ফিল্টার করা বেস্ট)
    if (search) {
      articles = articles.filter((article) => {
        const haystack = `${article.title || ""} ${article.excerpt || ""} ${article.author || ""} ${article.categoryTitle || ""}`;
        return haystack.toLowerCase().includes(search);
      });
    }

    // ৪. লিমিট প্রপস হ্যান্ডেল করা
    const totalArticlesCount = articles.length;
    if (limitNum && limitNum > 0) {
      articles = articles.slice(0, limitNum);
    }

    // ৫. রেসপন্স ফরম্যাট (আপনার আগের স্ট্রাকচার ঠিক রেখে)
    return Response.json({
      categories: categoriesList.map((c) => ({
        slug: c.slug,
        title: c.title,
        description: c.description,
        articleCount: c.articleCount || 0,
      })),
      total: totalArticlesCount,
      returned: articles.length,
      articles: articles,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return Response.json(
      { error: "An error occurred while fetching news data." },
      { status: 500 },
    );
  }
}
