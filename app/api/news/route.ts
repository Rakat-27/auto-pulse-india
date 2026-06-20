import { readRecord, values } from "@/lib/realtime-db";

type Category = {
  slug?: string;
  title?: string;
  description?: string;
  articleCount: number;
};

type Article = Record<string, unknown> & {
  id: string;
  categorySlug?: string;
  publishedAt?: string;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim();
    const search = searchParams.get("search")?.trim().toLowerCase();
    const limitParam = searchParams.get("limit");
    const limitNum = limitParam ? Number.parseInt(limitParam, 10) : undefined;

    const [categoriesData, articlesData] = await Promise.all([
      readRecord<Record<string, Omit<Category, "articleCount">>>("categories"),
      readRecord<Record<string, Omit<Article, "id">>>("articles"),
    ]);
    const categoriesList = values(categoriesData).map((category) => ({
      ...category,
      articleCount: 0,
    }));

    // ক্যাটেগরি ভ্যালিডেশন (যদি রিকোয়েস্টে কোনো ক্যাটেগরি স্লাগ থাকে)
    if (category && !categoriesList.some((c) => c.slug === category)) {
      return Response.json(
        { error: `Unknown category: ${category}` },
        { status: 404 },
      );
    }

    let articles: Article[] = Object.entries(articlesData ?? {}).map(([id, article]) => ({
      id,
      ...article,
    }));
    if (category) articles = articles.filter((article) => article.categorySlug === category);
    articles.sort((a, b) => String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? "")));

    for (const article of articles) {
      const matchingCategory = categoriesList.find((item) => item.slug === article.categorySlug);
      if (matchingCategory) matchingCategory.articleCount += 1;
    }

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
