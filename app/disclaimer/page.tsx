import Link from "next/link";
import { FaChevronLeft, FaExclamationTriangle } from "react-icons/fa";

export default function DisclaimerPage() {
  return (
    <main className="bg-white min-h-screen text-zinc-900 select-none">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* ==========================================
            BACK TO HOME BUTTON (হোম পেজে ফেরার বাটন)
           ========================================== */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-red-600 hover:text-red-500 hover:underline mb-8 transition-colors cursor-pointer"
        >
          <FaChevronLeft size={10} /> Back to Home
        </Link>

        {/* Page Header */}
        <div className="border-b border-zinc-200 pb-6 mb-8 flex items-center gap-4">
          <div className="bg-zinc-100 p-3 rounded-md text-red-600">
            <FaExclamationTriangle size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-zinc-900">
              Disclaimer
            </h1>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">
              Last Updated: June 2026
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8 text-zinc-600 font-medium text-sm leading-relaxed">
          <section className="bg-[#fcfcfc] border border-zinc-200 rounded-md p-6 shadow-sm">
            <h2 className="text-zinc-800 font-black uppercase tracking-wider text-base mb-3">
              1. General Information
            </h2>
            <p>
              The information provided by{" "}
              <span className="text-zinc-900 font-bold italic">
                Auto<span className="text-red-600">PULSE</span>
              </span>{" "}
              (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) on this website is for general
              informational purposes only. All information on the site is
              provided in good faith, however, we make no representation or
              warranty of any kind, express or implied, regarding the accuracy,
              adequacy, validity, reliability, availability, or completeness of
              any information on the site.
            </p>
          </section>

          <section className="bg-[#fcfcfc] border border-zinc-200 rounded-md p-6 shadow-sm">
            <h2 className="text-zinc-800 font-black uppercase tracking-wider text-base mb-3">
              2. Vehicle Specifications & Prices
            </h2>
            <p className="mb-3">
              Car and bike specifications, features, prices, and expected launch
              dates mentioned on AutoPulse are dynamic and subject to change by
              the respective manufacturers without prior notice.
            </p>
            <p>
              While we strive to keep the data updated, actual on-road prices,
              features, and availability may vary based on your location and
              dealership. Always verify details with authorized dealers before
              making a purchase decision.
            </p>
          </section>

          <section className="bg-[#fcfcfc] border border-zinc-200 rounded-md p-6 shadow-sm">
            <h2 className="text-zinc-800 font-black uppercase tracking-wider text-base mb-3">
              3. External Links Disclaimer
            </h2>
            <p>
              The site may contain links to external websites or content
              belonging to third parties. Such external links are not
              investigated, monitored, or checked for accuracy, adequacy,
              reliability, or completeness by us. We do not warrant, endorse,
              guarantee, or assume responsibility for the accuracy or
              reliability of any information offered by third-party websites
              linked through the site.
            </p>
          </section>

          <section className="bg-[#fcfcfc] border border-zinc-200 rounded-md p-6 shadow-sm">
            <h2 className="text-zinc-800 font-black uppercase tracking-wider text-base mb-3">
              4. Expert Opinions & User Reviews
            </h2>
            <p>
              The views and opinions expressed in articles, reviews, or videos
              are those of the authors and auto experts and do not necessarily
              reflect the official policy or position of AutoPulse. Any content
              provided by our bloggers or authors is of their opinion and is not
              intended to malign any religion, ethnic group, club, organization,
              company, or individual.
            </p>
          </section>

          <section className="bg-[#fcfcfc] border border-zinc-200 rounded-md p-6 shadow-sm">
            <h2 className="text-zinc-800 font-black uppercase tracking-wider text-base mb-3">
              5. &quot;Use at Your Own Risk&quot;
            </h2>
            <p>
              Your use of the website and your reliance on any information on
              the site is solely at your own risk. AutoPulse and its team shall
              not be held liable for any loss or damage of any kind incurred as
              a result of the use of the site or reliance on any information
              provided on the site.
            </p>
          </section>
        </div>

        {/* Footer info inside page */}
        <div className="mt-12 pt-6 border-t border-zinc-200 text-center text-xs text-zinc-400 font-bold">
          If you require any more information or have any questions about our
          site&apos;s disclaimer, please feel free to contact us via our Contact
          Page.
        </div>
      </div>
    </main>
  );
}
