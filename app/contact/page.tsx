"use client";

import React, { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

type SubmitStatus = "idle" | "success" | "error";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Unable to send your message.");
      }

      setSubmitStatus("success");
      setStatusMessage(data.message || "Message sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unable to send your message right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white min-h-screen text-zinc-900 select-none py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black uppercase tracking-wider mb-2 text-zinc-900">
            Contact <span className="text-red-600">Us</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold max-w-md mx-auto">
            Have any questions, feedback, or suggestions? Reach out to the
            AutoPulse team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Info Cards */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <div className="bg-[#fcfcfc] border border-zinc-200 p-4 rounded-sm flex items-start gap-3 shadow-sm">
              <FaPhoneAlt className="text-red-600 mt-1" size={14} />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800">
                  Call Us
                </h3>
                <p className="text-[11px] text-zinc-500 font-bold mt-1">
                  +880 1234 567890
                </p>
              </div>
            </div>

            <div className="bg-[#fcfcfc] border border-zinc-200 p-4 rounded-sm flex items-start gap-3 shadow-sm">
              <FaEnvelope className="text-red-600 mt-1" size={14} />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800">
                  Email
                </h3>
                <p className="text-[11px] text-zinc-500 font-bold mt-1">
                  contact@autopulse.com
                </p>
              </div>
            </div>

            <div className="bg-[#fcfcfc] border border-zinc-200 p-4 rounded-sm flex items-start gap-3 shadow-sm">
              <FaMapMarkerAlt className="text-red-600 mt-1" size={14} />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800">
                  Location
                </h3>
                <p className="text-[11px] text-zinc-500 font-bold mt-1">
                  Sylhet, Bangladesh
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#fcfcfc] border border-zinc-200 p-6 rounded-sm md:col-span-2 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-white text-zinc-900 border border-zinc-200 focus:border-red-600 outline-none p-2.5 text-xs rounded-sm transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-white text-zinc-900 border border-zinc-200 focus:border-red-600 outline-none p-2.5 text-xs rounded-sm transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="bg-white text-zinc-900 border border-zinc-200 focus:border-red-600 outline-none p-2.5 text-xs rounded-sm transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="bg-white text-zinc-900 border border-zinc-200 focus:border-red-600 outline-none p-2.5 text-xs rounded-sm resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-sm transition-colors mt-2 shadow-sm"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {submitStatus !== "idle" && (
                <p
                  className={`text-[11px] font-bold ${
                    submitStatus === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {statusMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
