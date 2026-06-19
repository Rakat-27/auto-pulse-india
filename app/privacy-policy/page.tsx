"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white min-h-screen text-zinc-900 select-none py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black uppercase tracking-wider mb-2 text-zinc-900">
            Privacy <span className="text-red-600">Policy</span>
          </h1>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
            Last Updated: June 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#fcfcfc] border border-zinc-200 p-6 md:p-8 rounded-sm flex flex-col gap-6 text-[12px] text-zinc-600 font-medium leading-relaxed shadow-sm">
          <section>
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800 mb-2">
              1. Introduction
            </h2>
            <p>
              Welcome to AutoPulse. We respect your privacy and are committed to
              protecting any personal information you share with us. This
              Privacy Policy explains how we collect, use, and safeguard your
              data when you visit our website.
            </p>
          </section>

          <hr className="border-zinc-200" />

          <section>
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800 mb-2">
              2. Information We Collect
            </h2>
            <p className="mb-2">
              We may collect personal information that you voluntarily provide
              to us, including:
            </p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2 text-zinc-500">
              <li>
                <strong className="text-zinc-700">
                  Newsletter Subscription:
                </strong>{" "}
                Your email address when you subscribe.
              </li>
              <li>
                <strong className="text-zinc-700">Contact Form:</strong> Your
                name, email address, and any details shared via the contact
                page.
              </li>
              <li>
                <strong className="text-zinc-700">Cookies & Analytics:</strong>{" "}
                Standard automated data such as IP address and browser type to
                improve user experience.
              </li>
            </ul>
          </section>

          <hr className="border-zinc-200" />

          <section>
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800 mb-2">
              3. How We Use Your Information
            </h2>
            <p className="mb-2">
              The information we collect is used solely to:
            </p>
            <ul className="list-disc list-inside flex flex-col gap-1 pl-2 text-zinc-600">
              <li>Deliver the latest auto news, updates, and newsletters.</li>
              <li>
                Respond directly to queries submitted through our contact form.
              </li>
              <li>
                Analyze website traffic to optimize performance and content
                delivery.
              </li>
            </ul>
          </section>

          <hr className="border-zinc-200" />

          <section>
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800 mb-2">
              4. Data Protection
            </h2>
            <p>
              We implement industry-standard security measures to secure your
              data. However, please note that no method of transmission over the
              internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <hr className="border-zinc-200" />

          <section>
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800 mb-2">
              5. Third-Party Links
            </h2>
            <p>
              Our website may contain links to external sites (such as brand
              partners or official auto manufacturers). We do not operate or
              control these third-party websites and are not responsible for
              their individual privacy practices.
            </p>
          </section>

          <hr className="border-zinc-200" />

          <section>
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800 mb-2">
              6. Changes to This Policy
            </h2>
            <p>
              AutoPulse reserves the right to update this Privacy Policy at any
              time. Any changes will be updated directly on this page with a
              revised date.
            </p>
          </section>

          <hr className="border-zinc-200" />

          {/* Action Button */}
          <div className="text-center mt-4">
            <Link
              href="/"
              className="inline-block bg-zinc-900 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest py-2.5 px-6 rounded-sm transition-colors shadow-sm"
            >
              Back To Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
