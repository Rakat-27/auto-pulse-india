"use client";

import { FaBolt, FaCompass, FaGears, FaLightbulb } from "react-icons/fa6";

export default function FeaturesPage() {
  return (
    <main className="bg-white min-h-screen text-zinc-900 select-none py-16 px-4 transition-colors duration-200 dark:bg-black dark:text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Title */}
        <div className="border-b border-zinc-200 pb-4 mb-10 dark:border-zinc-900">
          <span className="text-red-600 text-[10px] font-black uppercase tracking-widest bg-red-600/10 px-3 py-1 rounded-full border border-red-600/20">
            Premium Insights
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider mt-3">
            AutoPulse <span className="text-red-600">Features</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-1 uppercase font-bold tracking-wider">
            In-depth analysis, technical deep dives, and long-form automotive
            stories.
          </p>
        </div>

        {/* Features Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-[#fcfcfc] border border-zinc-200 p-6 rounded-sm hover:border-zinc-300 transition-colors group dark:bg-[#0e0e10] dark:border-zinc-900 dark:hover:border-zinc-800">
            <div className="text-red-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <FaBolt size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 mb-2 dark:text-white">
              Next-Gen EV Tech Breakdowns
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              We look past the marketing fluff. Our technical deep-dives analyze
              motor efficiency, solid-state battery thermal management, and
              regenerative braking algorithms of modern electric vehicles.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#fcfcfc] border border-zinc-200 p-6 rounded-sm hover:border-zinc-300 transition-colors group dark:bg-[#0e0e10] dark:border-zinc-900 dark:hover:border-zinc-800">
            <div className="text-red-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <FaGears size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 mb-2 dark:text-white">
              Chassis & Aerodynamics Engineering
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Discover how track-focused cars slice through air resistance. Read
              architectural documentation regarding downforce vectors, active
              splitters, and monocoque stiffness scores.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#fcfcfc] border border-zinc-200 p-6 rounded-sm hover:border-zinc-300 transition-colors group dark:bg-[#0e0e10] dark:border-zinc-900 dark:hover:border-zinc-800">
            <div className="text-red-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <FaCompass size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 mb-2 dark:text-white">
              Restoration Stories & Heritage
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Take a walk down history lane. We cover classic vintage muscle car
              or motorcycle rebuild projects, exploring the preservation of
              legacy mechanical heritage across the globe.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#fcfcfc] border border-zinc-200 p-6 rounded-sm hover:border-zinc-300 transition-colors group dark:bg-[#0e0e10] dark:border-zinc-900 dark:hover:border-zinc-800">
            <div className="text-red-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <FaLightbulb size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 mb-2 dark:text-white">
              Future of Mobility Concept Studies
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Hydrogen cells, automated Level 5 ADAS clusters, and synthetic
              fuel projects. Get a clear glimpse of what transportation looks
              like in the late 2020s and beyond.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
