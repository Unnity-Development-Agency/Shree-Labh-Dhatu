"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ContactDealerButton from "./ContactDealerButton";

const EASE = [0.22, 1, 0.36, 1];

/* Same scroll-reveal system used across the site's other sections —
   replays every time the section re-enters the viewport (once: false). */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* Applications/industries don't carry an icon in the data (icons aren't
   JSON-serializable), so each card picks one from this small rotating
   set based on its position — purely decorative, never load-bearing. */

export default function CopperVariantSection({
  product,
  index,
  materialName = "Copper",
}) {
  const reduceMotion = useReducedMotion();
  const isReversed = index % 2 === 1;
  const [openPanel, setOpenPanel] = React.useState("features");

  return (
    <section
      id={product.id}
      aria-labelledby={`${product.id}-heading`}
      className={`scroll-mt-24 px-5 py-9 sm:px-8 sm:py-11 lg:px-12 lg:py-14 ${
        index % 2 === 0 ? "bg-[#f8f7f4]" : "bg-[#f1f0ec]"
      }`}
    >
      <motion.div
        initial={false}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        variants={reduceMotion ? undefined : containerVariants}
        className="mx-auto max-w-7xl"
      >
        {/* ---------- Image + intro, two-column on desktop ---------- */}
        <div
          className={`grid grid-cols-1 items-center gap-7 lg:grid-cols-2 lg:gap-12 ${
            isReversed ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="relative flex min-h-52 items-center justify-center overflow-hidden border-y border-zinc-200 bg-[#f6f5f1] p-5 sm:min-h-64 lg:border lg:border-zinc-100"
          >
            <div
              className="absolute h-56 w-56 rounded-full bg-[#E53935]/[0.06] blur-3xl sm:h-72 sm:w-72"
              aria-hidden="true"
            />
            <img
              src={product.image}
              alt={`${product.name} — premium industrial copper product`}
              className="relative z-10 h-44 w-auto max-w-full object-contain drop-shadow-xl sm:h-56 lg:h-64"
            />
          </motion.div>

          <motion.div variants={reduceMotion ? undefined : fadeUpVariants}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E53935]">
                {materialName} Product
              </span>
              <span className="h-px w-8 bg-zinc-200" />
              <span className="text-[10px] font-bold tracking-[0.18em] text-zinc-400">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h2
              id={`${product.id}-heading`}
              className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl"
            >
              {product.name}
            </h2>
            <span className="mt-4 block h-1 w-14 rounded-full bg-[#E53935]" />
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-zinc-700 sm:text-base">
              {product.shortDescription}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base">
              {product.description}
            </p>

            {/* <ContactDealerButton productName={product.name} className="mt-5" /> */}
          </motion.div>
        </div>

        {/* ---------- Key Features ---------- */}
        <motion.section
          variants={reduceMotion ? undefined : fadeUpVariants}
          className="mt-8 border-t border-zinc-200 pt-6"
        >
          <button
            type="button"
            onClick={() =>
              setOpenPanel(openPanel === "features" ? "" : "features")
            }
            aria-expanded={openPanel === "features"}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-zinc-700">
              <span className="text-xs text-[#E53935]">01</span> Key Features
            </span>
            <ChevronDown
              className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${openPanel === "features" ? "rotate-180" : ""}`}
            />
          </button>
          {openPanel === "features" && (
            <div className="mt-3 overflow-hidden border border-zinc-200">
              <div className="grid grid-cols-2 gap-px bg-zinc-200 sm:grid-cols-3 lg:grid-cols-6">
                {product.features.map((feature) => (
                  <div
                    key={feature}
                    className="bg-white px-2 py-3 text-center transition-colors duration-300 hover:bg-[#fff8f7] sm:px-3"
                  >
                    <span className="text-xs font-semibold leading-snug text-zinc-600 sm:text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        {/* ---------- Applications ---------- */}
        <motion.section
          variants={reduceMotion ? undefined : fadeUpVariants}
          className="mt-7"
        >
          <button
            type="button"
            onClick={() =>
              setOpenPanel(openPanel === "applications" ? "" : "applications")
            }
            aria-expanded={openPanel === "applications"}
            className="flex w-full items-center justify-between border-t border-zinc-200 pt-6 text-left"
          >
            <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-zinc-700">
              <span className="text-xs text-[#E53935]">02</span> Applications
            </span>
            <ChevronDown
              className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${openPanel === "applications" ? "rotate-180" : ""}`}
            />
          </button>
          {openPanel === "applications" && (
            <div className="mt-3 overflow-hidden border border-zinc-200">
              <div className="grid grid-cols-2 gap-px bg-zinc-200 sm:grid-cols-4">
                {product.applications.map((app) => (
                  <div
                    key={app.title}
                    className="bg-white px-2 py-3 text-center transition-colors duration-300 hover:bg-[#fff8f7] sm:px-3"
                  >
                    <span className="block text-xs font-bold uppercase tracking-wide text-zinc-600">
                      {app.title}
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug text-zinc-500">
                      {app.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        {/* ---------- Specifications ---------- */}
        {/* <motion.section
          variants={reduceMotion ? undefined : fadeUpVariants}
          className="mt-7"
        >
          <button
            type="button"
            onClick={() =>
              setOpenPanel(
                openPanel === "specifications" ? "" : "specifications",
              )
            }
            aria-expanded={openPanel === "specifications"}
            className="flex w-full items-center justify-between border-t border-zinc-200 pt-6 text-left"
          >
            <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-zinc-700">
              <span className="text-xs text-[#E53935]">03</span> Specifications
            </span>
            <ChevronDown
              className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${openPanel === "specifications" ? "rotate-180" : ""}`}
            />
          </button>
          {openPanel === "specifications" && (
            <div className="mt-3 overflow-hidden border border-zinc-200">
              <dl className="grid grid-cols-2 gap-px bg-zinc-200 sm:grid-cols-3 lg:grid-cols-6">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="bg-white px-2 py-3 text-center sm:px-3"
                  >
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                      {spec.label}
                    </dt>
                    <dd className="mt-1 text-xs font-semibold text-zinc-700 sm:text-sm">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </motion.section> */}

        {/* ---------- Per-variant Contact Dealer CTA ---------- */}
        <motion.div
          variants={reduceMotion ? undefined : fadeUpVariants}
          className="mt-8 flex flex-col items-center gap-3 border-y border-zinc-200 bg-zinc-50/70 px-5 py-7 text-center sm:px-8"
        >
          <h3 className="text-lg font-semibold tracking-tight text-zinc-700 sm:text-xl">
            Need {product.name}?
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-zinc-500">
            Contact our dealer team for pricing, availability and product
            specifications.
          </p>
          <ContactDealerButton
            productName={product.name}
            className="w-full justify-center"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
