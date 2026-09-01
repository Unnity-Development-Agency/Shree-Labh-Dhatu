"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { homeData } from "../../data/homeData";

const EASE = [0.22, 1, 0.36, 1];

const headingGroupVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const WhyChooseUS = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-[#f5f5f5] px-6 py-20 sm:py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        {/* Eyebrow + heading — fade up together, staggered, replays each time it re-enters view */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: false, amount: 0.6 }}
          variants={reduceMotion ? undefined : headingGroupVariants}
          className="flex w-full flex-col items-center"
        >
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="flex w-full max-w-sm items-center justify-center"
          >
            <span className="h-0.5 w-full max-w-20 rounded-full bg-[#E53935]" />
            <p className="mx-4 w-full whitespace-nowrap text-center text-sm font-bold uppercase tracking-[0.2em] text-[#E53935]">
              Why Choose Us
            </p>
            <span className="h-0.5 w-full max-w-20 rounded-full bg-[#E53935]" />
          </motion.div>

          <motion.h2
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="mt-4 text-center text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl"
          >
            Built on Quality. Backed by Trust.
          </motion.h2>
        </motion.div>

        {/* Card grid — staggers in on scroll, fades back out if scrolled past */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: false, amount: 0.2 }}
          variants={reduceMotion ? undefined : gridVariants}
          className="mt-14 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5"
        >
          {homeData.map((item) => (
            <motion.div
              key={item.id}
              variants={reduceMotion ? undefined : cardVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="group flex flex-col items-center gap-3 rounded-2xl px-4 py-10 text-center"
            >
              {/* Ring stays a fixed width — only its color opacity fades 0% → 100% on hover */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full max-w-28 rounded-full border-[3px] border-[#E53935]/0 object-cover p-4 transition-colors duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-[#E53935]"
              />

              <h3 className="text-lg font-bold text-zinc-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-600">
                {item.subtitle}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUS;
