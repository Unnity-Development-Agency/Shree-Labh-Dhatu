"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Zap,
  Layers3,
  Maximize2,
  Boxes,
  ArrowUpDown,
  Maximize,
  ShieldCheck,
  ArrowRight,
  Sparkle,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

/* Swap this for your own asset whenever it's ready — nothing else in the
   component depends on where the image lives. */
const productImage = "/images/home/Copper-sheet-trans.png";

const benefits = [
  { icon: Zap, title: "High Electrical", subtitle: "Conductivity" },
  { icon: Layers3, title: "Multiple", subtitle: "Thicknesses" },
  { icon: Maximize2, title: "Custom", subtitle: "Sizes" },
];

const specifications = [
  { icon: Boxes, label: "Grade", value: "C11000" },
  { icon: ArrowUpDown, label: "Thickness", value: "0.3mm – 100mm" },
  { icon: Maximize, label: "Width", value: "Up to 2000mm" },
  { icon: ShieldCheck, label: "Corrosion", value: "Resistant" },
];

/* Same scroll-reveal system used across the site's other sections —
   replays every time the section re-enters the viewport (once: false). */
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const benefitItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
};

export default function FeaturedProduct() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-zinc-800 px-2 py-14 text-zinc-100 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
      aria-labelledby="featured-product-heading"
    >
      {/*
        A small amount of hand-written CSS is used for exactly two things:
        1) the responsive `grid-template-areas` that reflow the section
           from mobile's natural top-to-bottom order into desktop's
           two-column layout (Tailwind's arbitrary-value syntax can't
           cleanly express multi-row quoted grid-template-areas strings);
        2) two very slow, purely decorative keyframe animations (ambient
           background drift, a gentle idle float on the product image)
           that Tailwind has no utility for. Everything else is Tailwind.
      */}
      <style>{`
        .fp-grid {
          display: grid;
          grid-template-areas:
            "eyebrow"
            "heading"
            "desc"
            "image"
            "benefits"
            "cta"
            "specs"
            "tagline";
        }
        @media (min-width: 1024px) {
          .fp-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-areas:
              "eyebrow eyebrow"
              "heading image"
              "desc image"
              "benefits image"
              "cta image"
              "specs specs"
              "tagline tagline";
          }
        }
        @keyframes fp-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0, -14px); }
        }
        @keyframes fp-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fp-shimmer {
          0%, 100% { transform: translateX(-120%); }
          50% { transform: translateX(160%); }
        }
      `}</style>

      {/* ---------- Background: very subtle (5–10% visible) industrial
          depth cues. Purely decorative, kept out of the accessibility
          tree, and clipped so nothing can cause overflow. ---------- */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(255,255,255,0.16) 1px, transparent 1.25px)",
            backgroundSize: "18px 18px",
            maskImage: "linear-gradient(to bottom, black, transparent 88%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(229,57,53,0.2),transparent_30%),radial-gradient(circle_at_10%_82%,rgba(180,83,9,0.16),transparent_26%)]" />
        <svg
          className="absolute -right-10 -top-10 hidden h-64 w-96 opacity-[0.18] sm:block"
          viewBox="0 0 400 260"
          fill="none"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1={60 + i * 40}
              y1="0"
              x2={-40 + i * 40}
              y2="260"
              stroke="#E53935"
              strokeWidth="1"
            />
          ))}
        </svg>

        <div className="absolute -bottom-16 -left-16 h-72 w-72 opacity-[0.22] sm:h-96 sm:w-96">
          <div className="absolute inset-0 rotate-12 rounded-[3rem] bg-gradient-to-br from-[#E53935] to-transparent blur-2xl" />
          <div className="absolute inset-8 -rotate-6 rounded-[3rem] bg-gradient-to-tr from-[#E53935] to-transparent blur-2xl" />
        </div>

        <div
          className="absolute bottom-10 left-1/3 h-40 w-56 opacity-[0.14]"
          style={{
            backgroundImage: "radial-gradient(#fb923c 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        <div
          className={`absolute right-[6%] top-[12%] h-56 w-56 rounded-full bg-[#E53935]/[0.14] blur-3xl sm:h-80 sm:w-80 lg:h-96 lg:w-96 ${
            reduceMotion
              ? ""
              : "motion-safe:[animation:fp-drift_10s_ease-in-out_infinite]"
          }`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl rounded-sm border border-white/10 bg-zinc-950/35 p-5 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8 lg:p-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden rounded-full"
          aria-hidden="true"
        >
          <div
            className={
              reduceMotion
                ? "hidden"
                : "h-full w-1/3 bg-gradient-to-r from-transparent via-orange-200/80 to-transparent motion-safe:[animation:fp-shimmer_5s_ease-in-out_infinite]"
            }
          />
        </div>
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: false, amount: 0.25 }}
          variants={reduceMotion ? undefined : containerVariants}
          className="fp-grid gap-x-10 gap-y-5 lg:items-center lg:gap-y-6"
        >
          {/* ---------- Eyebrow ---------- */}
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            style={{ gridArea: "eyebrow" }}
            className="flex items-center gap-3"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E53935]">
              Featured Product
            </span>
            <span className="hidden h-px flex-1 max-w-24 bg-[#E53935]/30 sm:block" />
            <motion.span
              animate={reduceMotion ? undefined : { rotate: [0, 15, -15, 0] }}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    }
              }
              className="hidden sm:block"
            >
              <Sparkle
                className="h-3.5 w-3.5 shrink-0 text-[#E53935]"
                aria-hidden="true"
              />
            </motion.span>
          </motion.div>

          {/* ---------- Heading ---------- */}
          <motion.header
            variants={reduceMotion ? undefined : fadeUpVariants}
            style={{ gridArea: "heading" }}
          >
            <h2
              id="featured-product-heading"
              className="text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Premium <span className="text-[#E53935]">Copper Plates</span>
            </h2>
            <motion.span
              initial={reduceMotion ? false : { width: 0 }}
              whileInView={reduceMotion ? undefined : { width: "2.5rem" }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
              className="mt-3 block h-1 rounded-full bg-[#E53935]"
            />
          </motion.header>

          {/* ---------- Description ---------- */}
          <motion.p
            variants={reduceMotion ? undefined : fadeUpVariants}
            style={{ gridArea: "desc" }}
            className="max-w-md text-sm leading-relaxed text-zinc-300 sm:text-base"
          >
            Engineered for superior conductivity, corrosion resistance and
            long-lasting performance in demanding applications.
          </motion.p>

          {/* ---------- Product image ---------- */}
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            style={{ gridArea: "image" }}
            className="group relative flex min-h-72 items-center justify-center overflow-hidden lg:h-full lg:min-h-0 lg:py-0"
          >
            <motion.svg
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 40, repeat: Infinity, ease: "linear" }
              }
              className="absolute h-52 w-52 opacity-[0.55] sm:h-64 sm:w-64 lg:h-80 lg:w-80"
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="100"
                cy="100"
                r="98"
                stroke="#E53935"
                strokeWidth="1"
                strokeDasharray="2 6"
              />
            </motion.svg>

            <motion.div
              className={
                reduceMotion
                  ? ""
                  : "motion-safe:[animation:fp-float_6s_ease-in-out_infinite]"
              }
            >
              <motion.img
                initial={
                  reduceMotion ? false : { opacity: 0, scale: 0.9, y: 12 }
                }
                whileInView={
                  reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }
                }
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE }}
                whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                src={productImage}
                alt="Stack of premium brushed copper plates with a polished industrial finish"
                className="relative z-10 h-44 w-auto max-w-full object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out sm:h-56 lg:h-72"
              />
            </motion.div>

            {/* signature element: premium quality seal, echoes the
                reference image's copper badge */}
            <motion.div
              initial={
                reduceMotion ? false : { opacity: 0, scale: 0.6, rotate: -12 }
              }
              whileInView={
                reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }
              }
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
              className="absolute left-2 top-2 z-20 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-[#E53935] p-2 text-center shadow-md shadow-[#E53935]/30 sm:left-22 sm:top-3 sm:h-20 sm:w-20"
            >
              <Sparkle
                className="mb-0.5 h-3 w-3 text-white/90"
                aria-hidden="true"
              />
              <span className="text-[7px] font-bold uppercase leading-tight tracking-wide text-white sm:text-[8px]">
                Exceptional Quality
              </span>
            </motion.div>
          </motion.div>

          {/* ---------- Benefits ---------- */}
          <motion.ul
            variants={reduceMotion ? undefined : containerVariants}
            style={{ gridArea: "benefits" }}
            className="flex flex-row flex-wrap gap-x-5 gap-y-3"
          >
            {benefits.map(({ icon: Icon, title, subtitle }) => (
              <motion.li
                key={title}
                variants={reduceMotion ? undefined : benefitItemVariants}
                whileHover={reduceMotion ? undefined : { x: 2 }}
                className="flex items-center gap-2.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E53935]/10 transition-colors duration-300">
                  <Icon className="h-4 w-4 text-[#E53935]" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium leading-tight text-zinc-100 sm:text-sm">
                  {title} {subtitle}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          {/* ---------- CTA ---------- */}
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            style={{ gridArea: "cta" }}
          >
            <motion.button
              type="button"
              aria-label="View copper plates product details"
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#E53935]/60 bg-[#E53935] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-[#E53935]/20 transition-colors duration-300 hover:bg-[#c92e2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E53935]"
            >
              View Product
              <ArrowRight
                className="h-3.5 w-3.5 text-[#E53935] transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </motion.button>
          </motion.div>

          {/* ---------- Specifications ---------- */}
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            style={{ gridArea: "specs" }}
            className="mt-3 overflow-hidden rounded-sm border border-white/10 bg-white/5"
          >
            <motion.ul
              variants={reduceMotion ? undefined : containerVariants}
              className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4"
            >
              {specifications.map(({ icon: Icon, label, value }) => (
                <motion.li
                  key={label}
                  variants={reduceMotion ? undefined : fadeUpVariants}
                  className="group flex flex-col items-center gap-1.5 bg-zinc-900/90 px-3 py-5 text-center transition-colors duration-300 hover:bg-zinc-800 sm:py-6"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E53935]/10 transition-transform duration-300 group-hover:scale-110">
                    <Icon
                      className="h-4.5 w-4.5 text-[#E53935]"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                    {label}
                  </span>
                  <span className="text-xs font-bold text-zinc-100 sm:text-sm">
                    {value}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ---------- Bottom tagline ---------- */}
          {/* <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            style={{ gridArea: "tagline" }}
            className="mt-6 flex items-center justify-center gap-4 sm:mt-8"
          >
            <Sparkle className="hidden h-3.5 w-3.5 shrink-0 text-[#E53935] sm:block" aria-hidden="true" />
            <span className="h-px flex-1 max-w-[8rem] bg-[#E53935]/30" />
            <p className="shrink-0 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 sm:text-xs">
              Built for Industry. Made to Last.
            </p>
            <span className="h-px flex-1 max-w-[8rem] bg-[#E53935]/30" />
            <Sparkle className="hidden h-3.5 w-3.5 shrink-0 text-[#E53935] sm:block" aria-hidden="true" />
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
}
