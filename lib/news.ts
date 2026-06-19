export type NewsArticle = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
};

export type NewsCategory = {
  title: string;
  description: string;
  articles: NewsArticle[];
};

export const categoryDetailsData: Record<string, NewsCategory> = {
  "car-news": {
    title: "Car News",
    description:
      "Stay ahead with the latest car launches, spy shots, EV updates, and automotive industry trends from global and local manufacturers.",
    articles: [
      {
        id: 1,
        title: "Next-Gen Tata Nexon EV Spied Testing with Advanced ADAS Radar",
        excerpt:
          "The bestseller is getting a major tech upgrade. New spy images reveal a front-mounted radar system, redesigned alloys, and a larger 14-inch touchscreen infotainment unit.",
        image:
          "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60",
        author: "Rahat Zaman",
        date: "June 11, 2026",
      },
      {
        id: 2,
        title: "Toyota Century SUV Officially Confirmed for South Asian Market",
        excerpt:
          "Toyota's ultra-luxury flagship SUV is ready to rival Rolls-Royce Cullinan at a fraction of the cost. Expected to host a 3.5L V6 plug-in hybrid powertrain.",
        image:
          "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60",
        author: "Asif Iqbal",
        date: "June 09, 2026",
      },
    ],
  },
  "bike-news": {
    title: "Bike News",
    description:
      "Get the latest updates on performance motorcycles, commuter bikes, premium sports tourers, and upcoming electric two-wheelers.",
    articles: [
      {
        id: 1,
        title: "Yamaha R15 V5 Launch Timeline Leaked: What to Expect?",
        excerpt:
          "Yamaha is rumored to introduce traction control modes and a lighter subframe for the V5 version. Patent leaks suggest a minor power bump in the 155cc VVA engine.",
        image:
          "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&auto=format&fit=crop&q=60",
        author: "Sabbir Ahmed",
        date: "June 11, 2026",
      },
      {
        id: 2,
        title: "Suzuki Gixxer SF 250 Gets New Matte Titanium Edition",
        excerpt:
          "Suzuki has refreshed its quarter-liter line-up with a striking matte color scheme and smartphone navigation assistance as standard feature.",
        image:
          "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=60",
        author: "Imran Khan",
        date: "June 08, 2026",
      },
    ],
  },
  reviews: {
    title: "Expert Reviews",
    description:
      "In-depth, unbiased, and comprehensive track and road test reviews of the latest cars and bikes conducted by our expert road testers.",
    articles: [
      {
        id: 1,
        title:
          "Comprehensive Road Test: Driving the All-New BMW X5 LCI Facelift",
        excerpt:
          "We spend a week with the straight-six mild-hybrid luxury SUV. Is it still the undisputed king of driving dynamics in its executive class?",
        image:
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=60",
        author: "Tahmid Hasan",
        date: "June 10, 2026",
      },
    ],
  },
  comparisons: {
    title: "Vehicle Comparisons",
    description:
      "Confused about your next purchase? Check out our head-to-head spec and real-world comparisons to make the right choice.",
    articles: [
      {
        id: 1,
        title: "Mega Shootout: Bajaj Pulsar NS400Z vs KTM Duke 390",
        excerpt:
          "Can the aggressively priced Pulsar NS400Z beat the corner rocket Duke 390 on sheer value and performance? The results might shock you.",
        image:
          "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=60",
        author: "Rahat Zaman",
        date: "June 07, 2026",
      },
    ],
  },
  "upcoming-vehicles": {
    title: "Upcoming Vehicles",
    description:
      "A comprehensive radar of highly anticipated cars, bikes, and EVs scheduled to break cover or hit dealerships very soon.",
    articles: [
      {
        id: 1,
        title:
          "Top 5 Highly Anticipated Performance Bikes Launching in Q3 2026",
        excerpt:
          "From updated Royal Enfield 650s to the all-new entry-level Aprilia RS, here is a detailed breakdown of the machines hitting the tarmac.",
        image:
          "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=60",
        author: "Sabbir Ahmed",
        date: "June 05, 2026",
      },
    ],
  },
  videos: {
    title: "Videos & Walkarounds",
    description:
      "Watch high-quality cinematic reviews, exhaust notes, walkaround videos, and event coverage from our official media team.",
    articles: [
      {
        id: 1,
        title: "Video: Mahindra Thar 5-Door Armado Deep Mud Off-Road Test",
        excerpt:
          "We take the rugged 5-door Thar into extreme slush tracks to test its updated MLD and low-range gearbox configuration. Watch the complete review.",
        image:
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=60",
        author: "AutoPulse Media",
        date: "June 11, 2026",
      },
    ],
  },
  features: {
    title: "Special Features & Tech",
    description:
      "Explore tech deep-dives, historical lookbacks, maintenance tips, and opinion pieces from the world of motoring.",
    articles: [
      {
        id: 1,
        title: "How Dual-Chamber Air Suspension Works in Modern Vehicles?",
        excerpt:
          "An easy-to-understand breakdown of the physics and electronics behind the ultra-smooth ride adaptive air suspensions offer.",
        image:
          "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=60",
        author: "Asif Iqbal",
        date: "June 02, 2026",
      },
    ],
  },
};

export function getAllArticles() {
  return Object.entries(categoryDetailsData).flatMap(([slug, category]) =>
    category.articles.map((article) => ({
      ...article,
      categorySlug: slug,
      categoryTitle: category.title,
    })),
  );
}
