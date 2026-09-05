"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  Building2,
  Cable,
  Factory,
  Lightbulb,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { servedData } from "@/data/homeData";

const EASE = [0.22, 1, 0.36, 1];
const industryIcons = [Zap, Sparkles, Lightbulb, Cable, Factory, Building2];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE } },
};

function IndustryCard({ item, index, reduceMotion }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 92%", "center 58%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 125,
    damping: 24,
    mass: 0.45,
  });
  const opacity = useTransform(progress, [0, 0.75], [0, 1]);
  const y = useTransform(progress, [0, 1], [72, 0]);
  const rotateX = useTransform(progress, [0, 1], [15, 0]);
  const rotateY = useTransform(progress, [0, 1], [index % 2 === 0 ? -8 : 8, 0]);
  const scale = useTransform(progress, [0, 1], [0.94, 1]);
  const Icon = industryIcons[index % industryIcons.length];

  return (
    <div ref={cardRef} className="perspective-distant">
      <motion.article
        variants={reduceMotion ? undefined : cardVariants}
        style={
          reduceMotion
            ? undefined
            : {
                opacity,
                y,
                rotateX,
                rotateY,
                scale,
                transformPerspective: 1400,
              }
        }
        whileHover={
          reduceMotion
            ? undefined
            : { y: -6, rotateY: index % 2 === 0 ? 1.5 : -1.5 }
        }
        transition={{ duration: 0.22, ease: EASE }}
        className="group relative min-h-64 overflow-hidden rounded-sm border border-[var(--line)]/90 bg-[var(--surface)] shadow-[0_16px_34px_-28px_rgba(24,24,27,0.5)] transition-shadow hover:border-[var(--brand)]/25 hover:shadow-[0_24px_38px_-28px_rgba(245,61,20,0.5)] sm:min-h-72 pointer-events-none"
      >
        <div className="flex h-full min-h-64 sm:min-h-72">
          <div className="relative z-10 flex w-[64%] flex-col justify-between p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-[var(--brand)]/[0.09] text-[var(--brand-ink)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold tracking-[0.16em] text-zinc-400">
                0{index + 1}
              </span>
            </div>
            <div className="mt-10">
              <span className="mb-3 block h-0.5 w-9 bg-[var(--brand)]" />
              <h3 className="text-lg font-bold leading-tight text-[var(--ink)] sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {item.description}
              </p>
            </div>
          </div>
          <div className="relative w-[36%] overflow-hidden bg-[#f2eae9]">
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 36vw, 18vw"
              className="object-cover opacity-85 transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/0.5 to-transparent" />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

const ServedIndustry = () => {
  const reduceMotion = useReducedMotion();
  const viewport = { once: true, amount: 0.16 };

  return (
    <section className="relative overflow-hidden bg-[var(--surface-muted)] py-16 sm:py-20">
      <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-[var(--brand)]/[0.035] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={viewport}
          variants={reduceMotion ? undefined : containerVariants}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="mx-auto flex w-full max-w-sm items-center justify-center"
          >
            <span className="h-0.5 w-full max-w-20 rounded-full bg-[var(--brand)]" />
            <p className="mx-4 whitespace-nowrap text-sm font-bold uppercase tracking-[0.2em] text-[var(--brand-ink)]">Industries we serve</p>
            <span className="h-0.5 w-full max-w-20 rounded-full bg-[var(--brand)]" />
          </motion.div>
          <motion.h2
            variants={reduceMotion ? undefined : fadeUpVariants}
            id="served-industry-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl"
          >
            Materials that power{" "}
            <span className="text-[var(--ink)]">everyday industry.</span>
          </motion.h2>
          <motion.p
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base"
          >
            Dependable non-ferrous metals for products, infrastructure and
            specialist applications.
          </motion.p>
        </motion.header>

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={viewport}
          variants={reduceMotion ? undefined : containerVariants}
          className="mt-10 grid gap-5 md:grid-cols-2 lg:gap-7"
        >
          {servedData.map((item, index) => (
            <IndustryCard
              key={item.id}
              item={item}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </motion.div>
      </div>
      <section></section>
    </section>
  );
};

export default ServedIndustry;
