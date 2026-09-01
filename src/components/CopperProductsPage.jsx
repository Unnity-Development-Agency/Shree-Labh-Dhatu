"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight } from "lucide-react";
import copperProducts from "@/data/copperProducts";
import CopperVariantSection from "@/components/CopperVariantSection";
import Footer from "@/components/ui/Footer";
import MetalHeroCanvas from "@/components/MetalHeroCanvas";

const materialCopy = {
  Copper:
    "High-conductivity metal stock for electrical, industrial, and fabrication requirements.",
  Brass:
    "Reliable brass stock engineered for precision components, fittings, and fabrication.",
  Aluminium:
    "Lightweight, versatile material supply for modern fabrication and industrial use.",
  "Stainless Steel":
    "Durable, corrosion-resistant stock for demanding fabrication and engineering work.",
};

export default function CopperProductsPage({
  products = copperProducts,
  materialName = "Copper",
}) {
  const [activeProduct, setActiveProduct] = useState(products[0]?.id);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const sections = products
      .map((product) => document.getElementById(product.id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveProduct(visible.target.id);
      },
      { rootMargin: "-35% 0px -50%", threshold: [0.1, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [products]);

  const scrollToProduct = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <main className="bg-[#f8f7f4]">
        <section
          className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-[#121316] px-5 py-14 text-white sm:px-8 lg:px-12"
          onMouseMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            setPointer({
              x: ((event.clientX - bounds.left) / bounds.width) * 100,
              y: ((event.clientY - bounds.top) / bounds.height) * 100,
            });
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-80 transition-[background] duration-300"
            style={{
              background: `radial-gradient(550px circle at ${pointer.x}% ${pointer.y}%, rgba(229,57,53,0.24), transparent 55%)`,
            }}
          />
          <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 left-[12%] h-80 w-80 rounded-full bg-[#E53935]/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white/55">
              <span className="h-px w-10 bg-[#E53935]" />
              Shree Labh Dhatu / Product Range
            </div>
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ff6a65]">
                  Premium metal supply
                </p>
                <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                  {materialName}
                  <span className="text-[#E53935]">.</span>
                  <br /> Built for work that matters.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
                  {materialCopy[materialName]}
                </p>
              </div>
              <MetalHeroCanvas
                materialName={materialName}
                variants={products.length}
              />
            </div>
            <div className="mt-12 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              Move to explore
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
        </section>

        <nav
          className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[#f8f7f4]/90 px-4 py-3 backdrop-blur-xl sm:px-8 lg:px-12"
          aria-label={`${materialName} products`}
        >
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pt-12 pb-1 scrollbar-none">
            {products.map((product, index) => {
              const isActive = activeProduct === product.id;
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => scrollToProduct(product.id)}
                  className={`group flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                    isActive
                      ? "border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-zinc-900/15"
                      : "border-zinc-200 bg-white text-zinc-500 hover:border-[#E53935]/40 hover:text-zinc-900"
                  }`}
                >
                  <span
                    className={`text-[10px] ${isActive ? "text-[#ff6a65]" : "text-[#E53935]"}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {product.shortName ||
                    product.name.replace(`${materialName} `, "")}
                </button>
              );
            })}
          </div>
        </nav>

        {/* <section className="relative overflow-hidden px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E53935]">
                The collection
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-900 sm:text-4xl">
                Choose material with clarity, not compromise.
              </h2>
            </div>
            <div className="grid gap-0 sm:grid-cols-3">
              {[
                [
                  "01",
                  "Verified stock",
                  "Material selected for reliable industrial use.",
                ],
                [
                  "02",
                  "Flexible supply",
                  "Standard and requirement-based sizing support.",
                ],
                [
                  "03",
                  "Dealer guidance",
                  "Clear help with availability and specifications.",
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="border-t border-zinc-200 py-4 first:border-t-0 sm:border-l sm:border-t-0 sm:px-5 sm:first:border-l-0"
                >
                  <span className="text-xs font-bold text-[#E53935]">
                    {number}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-zinc-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {products.map((product, index) => (
          <CopperVariantSection
            key={product.id}
            product={product}
            index={index}
            materialName={materialName}
          />
        ))}
      </main>
      <Footer />
    </>
  );
}
