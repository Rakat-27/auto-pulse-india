"use client";

import React, { useState } from "react";
import {
  FaAward,
  FaCar,
  FaCheckCircle,
  FaMotorcycle,
  FaShieldAlt,
  FaTimes,
} from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";

export default function AboutUs() {
  // Modal Open/Close State Tracking
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Submit Confirmation State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmissionError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, subject: "Newsroom tip / query" }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to send your message.");

      setIsSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 2500);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Unable to send your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white min-h-screen text-zinc-900 select-none relative transition-colors duration-200 dark:bg-black dark:text-white">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-gradient-to-b from-zinc-100 to-white py-20 px-4 border-b border-zinc-200 text-center transition-colors duration-200 dark:from-zinc-900 dark:to-black dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <span className="text-red-600 text-[10px] font-black uppercase tracking-widest bg-red-600/10 px-3 py-1 rounded-full border border-red-600/20">
            Behind the Pulse
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 mt-4 mb-6 dark:text-white">
            About Auto<span className="text-red-600">PULSE</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            We are India&apos;s fast-growing automotive news portal, delivering
            precise insights, raw data, and professional expert evaluations
            straight from the asphalt.
          </p>
        </div>
      </section>

      {/* 2. STATS GRID STRIP */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#fcfcfc] border border-zinc-200 p-6 rounded-md shadow-2xl dark:bg-[#0e0e10] dark:border-zinc-800">
          <div className="text-center border-r border-zinc-200 last:border-none flex flex-col justify-center dark:border-zinc-800">
            <h3 className="text-2xl md:text-3xl font-black text-red-600">
              10M+
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
              Monthly Readers
            </p>
          </div>
          <div className="text-center md:border-r border-zinc-200 last:border-none flex flex-col justify-center dark:border-zinc-800">
            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
              1,500+
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
              Expert Reviews
            </p>
          </div>
          <div className="text-center border-r border-zinc-200 last:border-none flex flex-col justify-center dark:border-zinc-800">
            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">500+</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
              Verified Specifications
            </p>
          </div>
          <div className="text-center last:border-none flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">2026</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
              Industry Milestone
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-24 flex flex-col gap-20">
        {/* 3. OUR MISSION BLOCK */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-4">
            <div className="border-l-4 border-red-600 pl-4">
              <h2 className="text-xs font-black tracking-widest uppercase text-red-500">
                Our Mission
              </h2>
              <h3 className="text-2xl font-black text-zinc-900 uppercase mt-1 dark:text-white">
                Driving Transparency in Auto Journalism
              </h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Choosing the right car or bike shouldn&apos;t be complicated. At
              AutoPulse, we streamline your decision process by collecting data
              matrices, track timings, and physical user comfort testing points
              into highly organized specifications panels.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-zinc-300 font-semibold mt-2">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-red-600" /> 100% Unbiased review
                guidelines without dealer influence.
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-red-600" /> Real-time tracking of
                camouflaged upcoming vehicle testing mules.
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-red-600" /> Zero fluff data
                presentation focused only on practical mechanics.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#fcfcfc] border border-zinc-200 p-5 rounded-sm flex flex-col gap-3 dark:bg-[#0e0e10] dark:border-zinc-900">
              <FaCar size={24} className="text-red-600" />
              <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                Car Dynamics
              </h4>
              <p className="text-[11px] text-zinc-500 leading-normal">
                From commuter hatchbacks to high-voltage EV setups.
              </p>
            </div>
            <div className="bg-[#fcfcfc] border border-zinc-200 p-5 rounded-sm flex flex-col gap-3 dark:bg-[#0e0e10] dark:border-zinc-900">
              <FaMotorcycle size={24} className="text-red-600" />
              <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                Two-Wheeler Feeds
              </h4>
              <p className="text-[11px] text-zinc-500 leading-normal">
                Deep analytical reviews on street, cruiser, and sports
                categories.
              </p>
            </div>
          </div>
        </section>

        {/* 4. CORE VALUES SECTION */}
        <section className="flex flex-col">
          <div className="border-b border-zinc-200 pb-2 mb-8 text-center dark:border-zinc-800">
            <h2 className="text-sm font-black tracking-wider uppercase border-b-2 border-red-600 pb-2 -mb-[10px] inline-block">
              Why Readers Trust Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#fcfcfc] border border-zinc-200 p-6 rounded-sm hover:border-zinc-300 transition-colors dark:bg-[#070709] dark:border-zinc-900 dark:hover:border-zinc-800">
              <div className="bg-red-600/10 border border-red-600/20 text-red-600 w-10 h-10 flex items-center justify-center rounded-sm mb-4">
                <FaShieldAlt size={16} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-2 dark:text-white">
                Absolute Accuracy
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                We double-check internal leaks, manufacturer manifests, and
                regulatory documents before indexing any variant update info.
              </p>
            </div>
            <div className="bg-[#fcfcfc] border border-zinc-200 p-6 rounded-sm hover:border-zinc-300 transition-colors dark:bg-[#070709] dark:border-zinc-900 dark:hover:border-zinc-800">
              <div className="bg-red-600/10 border border-red-600/20 text-red-600 w-10 h-10 flex items-center justify-center rounded-sm mb-4">
                <IoSpeedometerOutline size={18} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-2 dark:text-white">
                High-Velocity Feeds
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Our dynamic content systems match real-world launch alerts
                within milliseconds of embargo drops across the country.
              </p>
            </div>
            <div className="bg-[#fcfcfc] border border-zinc-200 p-6 rounded-sm hover:border-zinc-300 transition-colors dark:bg-[#070709] dark:border-zinc-900 dark:hover:border-zinc-800">
              <div className="bg-red-600/10 border border-red-600/20 text-red-600 w-10 h-10 flex items-center justify-center rounded-sm mb-4">
                <FaAward size={16} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-2 dark:text-white">
                Expert Opinions
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Evaluations are compiled strictly by track-certified test
                drivers holding extensive mechanical knowledge base foundations.
              </p>
            </div>
          </div>
        </section>

        {/* 5. EDITORIAL TEAM BANNER */}
        <section className="bg-gradient-to-r from-zinc-50 to-white border border-zinc-200 p-8 rounded-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center dark:from-[#0a0a0c] dark:to-[#0e0e10] dark:border-zinc-900">
          <div className="md:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-red-500">
              AutoPulse Editorial
            </h4>
            <h3 className="text-xl font-black text-zinc-900 uppercase mt-1 mb-2 dark:text-white">
              Got a Tip or Query for Our Crew?
            </h3>
            <p className="text-zinc-500 text-[11px] max-w-2xl leading-relaxed">
              Our journalism desk functions 24/7. If you spotted an upcoming
              vehicle testing with camouflage vinyl wrapping or need precise
              cross-variant breakdown analyses, reach out instantly.
            </p>
          </div>
          <div className="md:col-span-1 flex md:justify-end">
            {/* Modal Activation Trigger */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest py-3 px-6 rounded-sm w-full md:w-auto transition-colors shadow-lg"
            >
              Contact Desk
            </button>
          </div>
        </section>
      </div>

      {/* =========================================================
          DYNAMIC OVERLAY POPUP MODAL (Contact Desk Form)
         ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="bg-white border border-zinc-200 rounded-md w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark:bg-[#0e0e10] dark:border-zinc-800">
            {/* Close Cross Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900 transition-colors dark:hover:text-white"
            >
              <FaTimes size={14} />
            </button>

            {isSubmitted ? (
              /* Success Submission State Display */
              <div className="py-8 flex flex-col items-center text-center gap-3">
                <FaCheckCircle
                  size={40}
                  className="text-red-600 animate-bounce"
                />
                <h4 className="text-lg font-black uppercase tracking-wide text-zinc-900 dark:text-white">
                  Message Transmitted
                </h4>
                <p className="text-xs text-zinc-400 max-w-[280px]">
                  Our editorial team will evaluate your vehicle submission tip
                  immediately.
                </p>
              </div>
            ) : (
              /* Core Submission Input Fields Container */
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                    Contact Newsroom
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Send leaks, news tips or specification correction queries.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="bg-white border border-zinc-200 focus:border-red-600 rounded-sm px-3 py-2 text-xs outline-none text-zinc-900 transition-all placeholder-zinc-400 dark:bg-black dark:border-zinc-800 dark:text-white dark:placeholder-zinc-700"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="bg-white border border-zinc-200 focus:border-red-600 rounded-sm px-3 py-2 text-xs outline-none text-zinc-900 transition-all placeholder-zinc-400 dark:bg-black dark:border-zinc-800 dark:text-white dark:placeholder-zinc-700"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    Message / Leak Details
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your vehicle spotting specs or news context..."
                    className="bg-white border border-zinc-200 focus:border-red-600 rounded-sm px-3 py-2 text-xs outline-none text-zinc-900 transition-all placeholder-zinc-400 resize-none dark:bg-black dark:border-zinc-800 dark:text-white dark:placeholder-zinc-700"
                  />
                </div>

                {submissionError && <p className="rounded-sm bg-red-50 p-2 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-300">{submissionError}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 text-white font-black uppercase text-[10px] tracking-widest py-2.5 rounded-sm transition-colors mt-2 shadow-md"
                >
                  {isSubmitting ? "Sending…" : "Dispatch to Editors"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
