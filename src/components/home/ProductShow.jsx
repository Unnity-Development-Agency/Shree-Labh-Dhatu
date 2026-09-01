"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Expand, Sparkle, X } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

/* Same scroll-reveal system as AboutUs — fades up on enter, resets when it
   scrolls back out of view (viewport once: false), so it replays every time
   the section is entered. */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
};

/**
 * All material + product data lives here. Add a new material by adding
 * one more key to this object — nothing else in the component needs to
 * change. Swap the `image` paths for your own local assets whenever
 * they're ready; nothing else depends on where they live.
 */
const MATERIALS = {
  copper: {
    name: "Copper",
    swatch: "/images/materials/copper/swatch.png",
    featured: {
      description:
        "High conductivity and excellent formability for industrial applications.",
    },
    products: [
      {
        name: "Sheet",
        image: "/images/home/Copper-sheet-trans.png",
        description:
          "Available in 90%, 98%, and 99% grades, with standard 14 × 48 inch sheets, half-hard and soft temper options, and custom sizes available on order.",
      },
      {
        name: "Coil",
        image: "/images/home/Copper-coil.png",
        description:
          "Available in a range of sizes and specifications, with copper coils supplied as per your requirements.",
      },
      {
        name: "Strip",
        image: "/images/home/Copper-Strip.png",
        description:
          "99% pure ETP copper strips with high electrical conductivity, available in various sizes as per your requirements.",
      },
      {
        name: "ETP Copper Nano Strip",
        image: "/images/home/ETP.png",
        description:
          "ETP copper nano strips with 100% electrical conductivity, designed for reliable performance across various applications.",
      },
      {
        name: "Scrap",
        image: "/images/home/Copper-strap.png",
        description:
          "High-grade ETP copper scrap available in 90%, 98%, and 99% purity grades, suitable for reliable recycling and reprocessing.",
      },
      { name: "Wire", image: "/images/home/Copper-Wire.png" },
    ],
  },
  brass: {
    name: "Brass",
    swatch: "/images/home/brass.png",
    featured: {
      description:
        "Excellent machinability and corrosion resistance for precision components.",
    },
    products: [
      {
        name: "Sheet",
        image: "/images/home/brass-sheets.png",
        description:
          "63% copper and 37% zinc brass sheets, available in standard 14 × 48 inch size, with half-hard and soft temper options and custom sizes available on order.",
      },
      {
        name: "Coil",
        image: "/images/home/brass-coil.png",
        description:
          "Brass coils available in a wide range of sizes, including 0.10, 0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20, 0.22, 0.23, 0.25, 0.37, 0.45, and 0.55 mm, with other sizes available as per requirement",
      },
      {
        name: "Strip",
        image: "/images/home/Brass-Strip.png",
        description:
          "Brass strips composed of 63% copper and 37% zinc, offering reliable quality for diverse industrial applications.",
      },
      { name: "Scrap", image: "/images/home/Brass-Scrap.png" },
      {
        name: "Wire",
        image: "/images/home/Brass-Wire.png",
        description:
          "Brass wires available in a variety of sizes and specifications to meet your specific requirements.",
      },
    ],
  },
  aluminium: {
    name: "Aluminium",
    swatch: "/images/home/Aluminium.png",
    featured: {
      description:
        "Lightweight strength with natural corrosion resistance for versatile fabrication.",
    },
    products: [
      {
        name: "Sheet",
        image: "/images/home/Aluminium-sheet.png",
        description:
          "Aluminium sheets available in a standard 4 × 8 ft size and various thicknesses to suit different requirements.",
      },
      {
        name: "Coil",
        image: "/images/home/Aluminium-coil.png",
        description:
          "Aluminium coils available in different thicknesses, with sizes and specifications tailored to your requirements.",
      },
    ],
  },
  stainlessSteel: {
    name: "Stainless Steel",
    swatch: "/images/home/stainless-steel.png",
    featured: {
      description:
        "Superior corrosion resistance and structural strength for demanding environments.",
    },
    products: [
      {
        name: "Sheet",
        image: "/images/home/Stainess-steel-sheet.png",
        description:
          " Stainless steel sheets available in Grade 202 and 304, with a standard size of 4 × 8 ft to meet diverse application requirements.",
      },
      {
        name: "Coil",
        image: "/images/home/Stainless-steel-coil.png",
        description:
          "Stainless steel coils available in Grade 202 and 304, with a range of sizes to meet your specific requirements.",
      },
    ],
  },
};

const MATERIAL_ORDER = ["copper", "brass", "aluminium", "stainlessSteel"];

/** True below Tailwind's `sm` breakpoint (640px) — i.e. phone screens. */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isMobile;
}

const AUTOPLAY_INTERVAL = 5000;

export default function MaterialsShowcase() {
  const [selected, setSelected] = useState("copper");
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const material = MATERIALS[selected];

  const selectMaterial = (key) => {
    setSelected(key);
    setSelectedProductIndex(0);
  };

  const closeImagePreview = () => {
    setIsImageOpen(false);
    setIsPaused(false);
  };

  // Auto-advance the active product every 2s. Pauses on hover/touch and is
  // skipped entirely if the user has reduced motion enabled.
  useEffect(() => {
    if (reduceMotion || isPaused) return undefined;
    const id = setInterval(() => {
      setSelectedProductIndex((prev) => (prev + 1) % material.products.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [reduceMotion, isPaused, material.products.length]);

  useEffect(() => {
    if (!isImageOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsImageOpen(false);
        setIsPaused(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isImageOpen]);

  const activeProduct = material.products[selectedProductIndex];
  const featuredTitle = `${material.name} ${activeProduct.name}`;
  // Every product carries its own description in MATERIALS above; fall
  // back to the material's general blurb only for the rare product that
  // doesn't have one yet (e.g. Wire/Scrap entries left without copy).
  const featuredDescription =
    activeProduct.description || material.featured.description;

  return (
    <section className="relative isolate w-full overflow-hidden bg-zinc-50 px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        @keyframes ps-drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -12px, 0); }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "radial-gradient(#e4e4e7 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage: "linear-gradient(to bottom, black, transparent 75%)",
          }}
        />
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-[#E53936]/[0.07] blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-orange-300/15 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-7xl">
        {/* Centered eyebrow + heading — identical treatment to AboutUs */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.2 }}
          variants={reduceMotion ? undefined : containerVariants}
          className="flex w-full flex-col items-center text-center"
        >
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="flex w-full max-w-xs items-center justify-center"
          >
            <span className="h-0.5 w-full max-w-20 rounded-full bg-[#E53935]" />
            <p className="mx-4 w-full whitespace-nowrap text-sm font-bold uppercase tracking-[0.2em] text-[#E53935]">
              Our Materials
            </p>
            <span className="h-0.5 w-full max-w-20 rounded-full bg-[#E53935]" />
          </motion.div>

          <motion.h2
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl"
          >
            Strong. <span className="text-[#E53935]">Reliable.</span> Ready.
          </motion.h2>

          <motion.p
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="mt-3 text-sm text-zinc-500 sm:text-base"
          >
            Premium metals for every industrial need.
          </motion.p>
        </motion.div>

        {/* ---------- Material selector ----------
            Phone: thin single-row scrollable chip strip.
            Desktop/tablet: compact header-style tab bar. */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.2 }}
          variants={reduceMotion ? undefined : fadeUpVariants}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={
            isMobile
              ? "scrollbar-none mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1"
              : "mx-auto mt-12 flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-zinc-200 bg-white/90 p-1.5 shadow-sm shadow-zinc-950/[0.05]"
          }
        >
          {MATERIAL_ORDER.map((key) => {
            const item = MATERIALS[key];
            const isActive = key === selected;

            if (isMobile) {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectMaterial(key)}
                  className={`group flex shrink-0 snap-start items-center gap-2.5 rounded-full border px-4 py-2.5 text-left transition-all duration-300 ${
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
                      src={item.swatch}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </span>
                </button>
              );
            }

            return (
              <motion.button
                key={key}
                type="button"
                onClick={() => selectMaterial(key)}
                layout
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className={`group relative flex h-11 shrink-0 items-center gap-2.5 rounded-lg px-3 text-left transition-colors duration-200 sm:px-4 ${
                  isActive
                    ? "text-white"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="material-tab-active"
                    className="absolute inset-0 rounded-lg bg-[#E53935] shadow-md shadow-[#E53935]/25"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
                <span
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors duration-200 ${
                    isActive ? "bg-white/15" : "bg-zinc-100"
                  }`}
                >
                  <img
                    src={item.swatch}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span
                  className={`relative z-10 whitespace-nowrap text-xs font-bold uppercase tracking-wide ${
                    isActive ? "text-white" : "text-zinc-700"
                  }`}
                >
                  {item.name}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ---------- Desktop grid wrapper ----------
            Mobile/tablet (below lg): plain block flow, so DOM order alone
            keeps the featured card above the horizontal product strip —
            identical to the original mobile/tablet behavior.
            Desktop (lg+): becomes a 2-column grid. Both children are
            pinned into the SAME row via explicit col/row placement, so
            the product selector (col 1) sits to the left of the featured
            card (col 2) regardless of DOM order. */}
        <div className="lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center lg:gap-6 mt-6">
          {/* ---------- Feature area — driven by BOTH the material tab above
              and the product strip below. Whichever product is active, its
              name/description/image slide in here. ---------- */}
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="relative mt-6 overflow-hidden rounded-sm border border-white bg-white/95 p-5 shadow-xl shadow-zinc-950/[0.06] sm:mt-8 sm:p-8 lg:col-start-2 lg:row-start-1 lg:mt-0 lg:p-10"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E53935] via-orange-400 to-transparent" />
            {/* faint dot grid, decorative */}
            <div
              className="pointer-events-none absolute right-8 top-8 hidden h-32 w-40 opacity-[0.12] lg:block"
              style={{
                backgroundImage:
                  "radial-gradient(#E53935 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selected}-${selectedProductIndex}`}
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12"
              >
                {/* Product image — same image used in the strip below */}
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsPaused(true);
                    setIsImageOpen(true);
                  }}
                  whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  aria-label={`View ${featuredTitle} image full screen`}
                  className="group relative flex min-h-64 w-full items-center justify-center overflow-hidden rounded-sm border border-zinc-100 bg-zinc-50 p-6 text-left sm:min-h-80 lg:min-h-96"
                >
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        "radial-gradient(#E53935 1px, transparent 1px)",
                      backgroundSize: "15px 15px",
                      maskImage:
                        "radial-gradient(circle at 50% 50%, black, transparent 70%)",
                    }}
                  />
                  <div
                    className={
                      reduceMotion
                        ? "absolute h-56 w-56 rounded-full bg-[#E53935]/10 blur-2xl sm:h-72 sm:w-72"
                        : "absolute h-56 w-56 rounded-full bg-[#E53935]/10 blur-2xl motion-safe:[animation:ps-drift_7s_ease-in-out_infinite] sm:h-72 sm:w-72"
                    }
                  />
                  <img
                    src={activeProduct.image}
                    alt={featuredTitle}
                    className="relative h-48 w-auto object-contain drop-shadow-[0_22px_20px_rgba(24,24,27,0.2)] transition-transform duration-300 group-hover:scale-105 sm:h-64 lg:h-72"
                  />
                  <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-xs border border-[#E53935]/15 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#E53935] shadow-sm backdrop-blur-sm">
                    <Sparkle className="h-3 w-3" aria-hidden="true" /> Maintain
                    Stock
                  </span>
                  <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xs bg-zinc-900/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white opacity-80 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                    <Expand className="h-3.5 w-3.5" aria-hidden="true" /> View
                    image
                  </span>
                </motion.button>

                {/* Product copy */}
                <div className="lg:border-l lg:border-zinc-100 lg:pl-12">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E53935] sm:text-sm">
                    Selected Product
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                    {featuredTitle}
                  </h3>
                  <span className="mt-4 block h-1 w-14 rounded-full bg-[#E53935]" />
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-600 sm:text-base">
                    {featuredDescription}
                  </p>
                  <button className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-zinc-700 cursor-pointer hover:scale-90 transition-all duration-300 ease-in-out">
                    Explore specification{" "}
                    <img
                      src="/images/btn-arrow.png"
                      alt="arrow right"
                      className="h-4 w-4"
                    />
                    {/* <ArrowRight
                      className="h-4 w-4 text-[#E53935]"
                      aria-hidden="true"
                    /> */}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ---------- Product strip ----------
              Phone: thin single-row scrollable chip strip (same styling as
              the material selector above).
              Tablet (below lg): original grid of vertical product cards,
              wrapped in a row.
              Desktop (lg+): same cards, stacked in a single vertical
              column to the left of the featured card. */}
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.15 }}
            variants={reduceMotion ? undefined : containerVariants}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="mt-8 sm:mt-10 lg:col-start-1 lg:row-start-1 lg:mt-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={
                  isMobile
                    ? "scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1"
                    : "flex flex-wrap justify-center gap-4 lg:w-40 lg:flex-col lg:flex-nowrap lg:justify-start lg:gap-3"
                }
              >
                {material.products.map((product, i) => {
                  const isActive = i === selectedProductIndex;

                  if (isMobile) {
                    return (
                      <motion.button
                        key={product.name}
                        type="button"
                        onClick={() => setSelectedProductIndex(i)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: i * 0.04,
                          ease: EASE,
                        }}
                        className={`group flex shrink-0 snap-start items-center gap-2.5 rounded-full border px-4 py-2.5 transition-all duration-300 ${
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
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-bold uppercase tracking-wide">
                          {product.name}
                          <ArrowRight
                            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${
                              isActive ? "text-white" : "text-[#E53935]"
                            }`}
                          />
                        </span>
                      </motion.button>
                    );
                  }

                  return (
                    <motion.button
                      key={product.name}
                      type="button"
                      onClick={() => setSelectedProductIndex(i)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.04,
                        ease: EASE,
                      }}
                      className={`group relative flex h-16 w-36 shrink-0 items-center rounded-sm border py-3 pl-14 pr-3 text-left transition-all duration-300 hover:-translate-y-1 sm:w-40 lg:w-full lg:hover:translate-y-0 lg:hover:-translate-x-1 ${
                        isActive
                          ? "border-[#E53935]/50 bg-gradient-to-b from-[#E53935]/[0.08] to-white shadow-lg shadow-[#E53935]/10"
                          : "border-white bg-white/80 shadow-sm shadow-zinc-950/[0.04] hover:border-[#E53935]/30 hover:shadow-md hover:shadow-black/5"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E53935] shadow-sm shadow-[#E53935]/40">
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                      )}
                      <span
                        className={`absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-sm transition-colors duration-300 ${
                          isActive ? "bg-white shadow-inner" : "bg-zinc-50"
                        }`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </span>
                      <span
                        className={`line-clamp-2 text-[10px] font-bold uppercase leading-tight tracking-wide sm:text-[11px] ${
                          isActive ? "text-[#E53935]" : "text-zinc-700"
                        }`}
                      >
                        {product.name}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <AnimatePresence>
          {isImageOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/75 p-4 backdrop-blur-sm sm:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeImagePreview}
              role="dialog"
              aria-modal="true"
              aria-label={`${featuredTitle} image preview`}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.28, ease: EASE }}
                onClick={(event) => event.stopPropagation()}
                className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-sm bg-white shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E53935]">
                      Product preview
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-zinc-900 sm:text-base">
                      {featuredTitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeImagePreview}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors hover:bg-[#E53935] hover:text-white"
                    aria-label="Close image preview"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[#f8f7f5] p-6 sm:p-10">
                  <img
                    src={activeProduct.image}
                    alt={featuredTitle}
                    className="max-h-[68vh] w-auto max-w-full object-contain drop-shadow-[0_28px_30px_rgba(24,24,27,0.2)] overflow-hidden"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
