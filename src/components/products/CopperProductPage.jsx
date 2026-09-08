"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Layers3,
  Truck,
  BadgeCheck,
  Award,
  Users,
  Zap,
  Building2,
  Car,
  Cog,
  Radio,
  ChevronRight,
} from "lucide-react";
import copperProducts from "@/data/copperProducts";
import ContactDealerButton from "@/components/ContactDealerButton";
import CopperVariantSection from "@/components/CopperVariantSection";
// Reuse the site's existing footer — not redesigned here.
import Footer from "@/components/Footer";

const EASE = [0.22, 1, 0.36, 1];

/* Same scroll-reveal system used across the rest of the site — replays
   every time a section re-enters the viewport (once: false). */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

/* Static marketing copy is kept data-driven too, so it's easy to edit
   without touching the JSX. Only the per-product content lives in the
   separate copperProducts data file, per the "one variant = one JSON
   entry" architecture. */
const whyChooseUs = [
  {
    icon: Award,
    title: "Premium Material Quality",
    description:
      "Every batch is sourced and verified against strict purity standards.",
  },
  {
    icon: BadgeCheck,
    title: "Consistent Product Standards",
    description: "Dimensional and quality checks on every order, every time.",
  },
  {
    icon: Layers3,
    title: "Wide Product Range",
    description: "Sheet, coil, strip, wire, and more — all under one roof.",
  },
  {
    icon: Truck,
    title: "Reliable Supply",
    description: "Consistent stock and dependable dispatch timelines.",
  },
  {
    icon: Cog,
    title: "Industrial Applications",
    description: "Suited to electrical, manufacturing, and construction use.",
  },
  {
    icon: ShieldCheck,
    title: "Quality-Assured Products",
    description: "Every variant tested and certified before it ships.",
  },
];

const industries = [
  { icon: Zap, title: "Electrical & Electronics" },
  { icon: Layers3, title: "Power & Energy" },
  { icon: Building2, title: "Construction" },
  { icon: Car, title: "Automotive" },
  { icon: Cog, title: "Manufacturing" },
  { icon: Radio, title: "Industrial Engineering" },
];

/** Smooth-scrolls to a product section, accounting for a sticky header. */
function scrollToProduct(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CopperProductsPage() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(copperProducts[0]?.id);
  const sectionRefs = useRef({});

  // Highlight whichever variant section is currently in view as the
  // visitor scrolls, so the selector above stays in sync.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    copperProducts.forEach((product) => {
      const el = document.getElementById(product.id);
      if (el) {
        sectionRefs.current[product.id] = el;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="w-full bg-white">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#fcfbf9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(#E53935 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
          aria-hidden="true"
        />

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: false, amount: 0.3 }}
          variants={reduceMotion ? undefined : containerVariants}
          className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
          <div>
            {/* breadcrumb */}
            <motion.nav
              variants={reduceMotion ? undefined : fadeUpVariants}
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-500"
            >
              <a href="/" className="hover:text-[#E53935]">
                Home
              </a>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <a href="/products" className="hover:text-[#E53935]">
                Our Products
              </a>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-zinc-900">Copper</span>
            </motion.nav>

            <motion.h1
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl"
            >
              Copper <span className="text-[#E53935]">Products</span>
            </motion.h1>

            <motion.p
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-zinc-700 sm:text-base"
            >
              A complete range of premium copper products — sheet, coil, strip,
              nano strip, scrap, and wire — engineered for conductivity,
              durability, and consistent industrial-grade quality.
            </motion.p>
            <motion.p
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base"
            >
              Every variant on this page is stocked, quality-checked, and ready
              to supply — from single fabrication runs to bulk industrial
              orders.
            </motion.p>

            <motion.div
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="mt-8"
            >
              <ContactDealerButton size="lg" />
            </motion.div>
          </div>

          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="relative flex items-center justify-center"
          >
            <div
              className="absolute h-64 w-64 rounded-full bg-[#E53935]/[0.07] blur-3xl sm:h-80 sm:w-80"
              aria-hidden="true"
            />
            <img
              src="/images/copper/hero.webp"
              alt="Assorted premium copper products — sheet, coil, and wire"
              className="relative z-10 h-64 w-auto max-w-full object-contain drop-shadow-2xl sm:h-80 lg:h-96"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ================= VARIANT SELECTOR ================= */}
      <div className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-3 sm:px-8 lg:px-12">
          <div className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth">
            <style>{`.scrollbar-none::-webkit-scrollbar { display: none; }`}</style>
            {copperProducts.map((product) => {
              const isActive = product.id === activeId;
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => scrollToProduct(product.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`group flex shrink-0 snap-start items-center gap-2.5 rounded-full border px-4 py-2 transition-all duration-300 ${
                    isActive
                      ? "border-[#E53935] bg-[#E53935] text-white shadow-md shadow-[#E53935]/20"
                      : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full ${
                      isActive ? "bg-white/15" : "bg-zinc-100"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain p-1"
                    />
                  </span>
                  <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wide">
                    {product.shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= OVERVIEW ================= */}
      <section className="bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: false, amount: 0.5 }}
          variants={reduceMotion ? undefined : containerVariants}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#E53935]"
          >
            Product Range
          </motion.p>
          <motion.h2
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
          >
            Explore Our Copper Products
          </motion.h2>
          <motion.p
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base"
          >
            We supply copper in multiple forms to suit different industrial,
            electrical, manufacturing, and commercial applications — each
            variant produced and quality-checked to the same rigorous standard,
            whatever the scale of your order.
          </motion.p>
        </motion.div>
      </section>

      {/* ================= DETAILED VARIANT SECTIONS ================= */}
      {copperProducts.map((product, index) => (
        <CopperVariantSection
          key={product.id}
          product={product}
          index={index}
        />
      ))}

      {/* ================= AT A GLANCE ================= */}
      <section className="bg-[#fcfbf9] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: false, amount: 0.5 }}
            variants={reduceMotion ? undefined : containerVariants}
            className="text-center"
          >
            <motion.p
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#E53935]"
            >
              Quick Overview
            </motion.p>
            <motion.h2
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
            >
              Copper Products at a Glance
            </motion.h2>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: false, amount: 0.15 }}
            variants={reduceMotion ? undefined : containerVariants}
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {copperProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={reduceMotion ? undefined : cardVariants}
                className="flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-6 text-center transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-auto object-contain"
                />
                <h3 className="mt-4 text-base font-bold text-zinc-900">
                  {product.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                  {product.shortDescription}
                </p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[#E53935] sm:text-xs">
                  {product.applications[0]?.title}
                </p>
                <button
                  type="button"
                  onClick={() => scrollToProduct(product.id)}
                  className="group mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-zinc-900 transition-colors duration-300 hover:text-[#E53935]"
                >
                  View Details
                  <ChevronRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= WHY CHOOSE OUR COPPER PRODUCTS ================= */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: false, amount: 0.5 }}
            variants={reduceMotion ? undefined : containerVariants}
            className="text-center"
          >
            <motion.p
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#E53935]"
            >
              Why Us
            </motion.p>
            <motion.h2
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
            >
              Why Choose Our Copper Products?
            </motion.h2>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: false, amount: 0.15 }}
            variants={reduceMotion ? undefined : containerVariants}
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {whyChooseUs.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={reduceMotion ? undefined : cardVariants}
                className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors duration-300 hover:border-[#E53935]/30"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E53935]/10">
                  <Icon className="h-5 w-5 text-[#E53935]" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-zinc-900 sm:text-base">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= INDUSTRIES ================= */}
      <section className="bg-[#fcfbf9] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: false, amount: 0.5 }}
            variants={reduceMotion ? undefined : containerVariants}
            className="text-center"
          >
            <motion.p
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#E53935]"
            >
              Industries We Serve
            </motion.p>
            <motion.h2
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
            >
              Built for Every Industry
            </motion.h2>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: false, amount: 0.15 }}
            variants={reduceMotion ? undefined : containerVariants}
            className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {industries.map(({ icon: Icon, title }) => (
              <motion.div
                key={title}
                variants={reduceMotion ? undefined : cardVariants}
                className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5 text-center"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E53935]/10">
                  <Icon className="h-5 w-5 text-[#E53935]" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold text-zinc-900 sm:text-sm">
                  {title}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden bg-zinc-900 px-5 py-16 text-center sm:px-8 sm:py-20 lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden="true"
        />
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: false, amount: 0.5 }}
          variants={reduceMotion ? undefined : containerVariants}
          className="relative mx-auto max-w-2xl"
        >
          <motion.h2
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            Looking for the Right Copper Product?
          </motion.h2>
          <motion.p
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base"
          >
            Talk to our team to find the right copper product for your
            application.
          </motion.p>
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="mt-8 flex justify-center"
          >
            <ContactDealerButton size="lg" />
          </motion.div>
        </motion.div>
      </section>

      {/* ================= FOOTER (existing, unmodified) ================= */}
      <Footer />
    </main>
  );
}
