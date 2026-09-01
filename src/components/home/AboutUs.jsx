"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * Tracks whether we're at/above Tailwind's `lg` breakpoint (1024px).
 * Used to pick the correct rail-trajectory keyframes so the products
 * never drift off the diagonal line on smaller screens.
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

/**
 * Rail trajectories.
 *
 * Measured against the actual illustration: the ceiling beam is a single,
 * shallow line running from near the top-left to the top-right, dropping
 * only slightly (roughly a 6% rise-over-run) — it is NOT a steep diagonal.
 * Both products ride this same beam from opposite ends, so their y/rotate
 * deltas must stay small and proportional to how far x has traveled, or
 * the product visibly drifts off the line.
 *
 * The beam slopes DOWN as it goes right, so the left product's y grows
 * (gently) positive while its x grows positive. The right product travels
 * the mirrored direction (x negative) and must rise as it moves left, so
 * its y is negative — the same magnitude as the left product's, mirrored.
 *
 * Desktop values are tuned to the full illustration width; mobile values
 * are proportionally scaled down so the product stays on-rail at smaller
 * image sizes.
 */
const RAIL_TRAJECTORIES = {
  desktop: {
    left: {
      x: [0, 60, 130, 200],
      y: [40, 52, 58, 75],
      rotate: [0, 1.2, 2.4, 3.5],
      scale: [1, 1.015, 1.03, 1.05],
    },
    right: {
      x: [0, -50, -80, -110],
      y: [0, 1, 2, 3],
      rotate: [0, -0.5, -1, -1.5],
      scale: [1, 1.01, 1.02, 1.03],
    },
  },
  mobile: {
    left: {
      x: [0, 34, 62, 86],
      y: [0, 2.5, 4, 5.5],
      rotate: [0, 0.3, 0.6, 1],
      scale: [1, 1.008, 1.015, 1.02],
    },
    right: {
      x: [0, -34, -62, -86],
      y: [0, -2.5, -4, -5.5],
      rotate: [0, -0.3, -0.6, -1],
      scale: [1, 1.008, 1.015, 1.02],
    },
  },
};

const railTransition = {
  duration: 9,
  ease: "linear",
  repeat: Infinity,
  repeatType: "reverse",
};

const AboutUs = () => {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  const trajectorySet = isDesktop
    ? RAIL_TRAJECTORIES.desktop
    : RAIL_TRAJECTORIES.mobile;

  const leftProductAnimation = reduceMotion
    ? { x: 0, y: 0, rotate: 0, scale: 1 }
    : trajectorySet.left;

  const rightProductAnimation = reduceMotion
    ? { x: 0, y: 0, rotate: 0, scale: 1 }
    : trajectorySet.right;

  return (
    <section className="w-full bg-white px-6 py-20 sm:py-24 overflow-hidden">
      <div className=" relative mx-auto w-full max-w-7xl">
        {/* Centered eyebrow + heading — same treatment as WhyChooseUS */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: false, amount: 0.6 }}
          variants={reduceMotion ? undefined : containerVariants}
          className="flex w-full flex-col items-center text-center"
        >
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="flex w-full max-w-xs items-center justify-center"
          >
            <span className="h-0.5 w-full max-w-20 rounded-full bg-[#E53935]" />
            <p className="mx-4 w-full whitespace-nowrap text-sm font-bold uppercase tracking-[0.2em] text-[#E53935]">
              About Us
            </p>
            <span className="h-0.5 w-full max-w-20 rounded-full bg-[#E53935]" />
          </motion.div>

          <motion.h2
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl"
          >
            Shree Labh Dhatu Traders Pvt. Ltd.
          </motion.h2>
        </motion.div>
        {/* Photo collage (left) + copy (right) — reversed from before, new photo treatment */}
        <div className="mt-14 grid w-full grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left column */}
          <div>
            <div className="relative">
              <img
                src="/images/home/BackBg.png"
                alt="About Us"
                className="w-full"
              />
              {/* top lines.. */}
              <div className="absolute top-0 left-5">
                <img
                  src="/images/home/lines.png"
                  alt="About Us"
                  className="w-full"
                />
              </div>
              <div className="absolute -bottom-22 z-10">
                <img
                  src="/images/home/FrontBg.png"
                  alt="About Us"
                  className="w-full"
                />
              </div>

              {/* Left product — travels left → right along the rail.
                  Positioned with % top/left (not rem/px) so it scales
                  proportionally with the illustration at every breakpoint. */}
              <div className="hidden  sm:block absolute top-[18%] left-[10%] h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                <motion.img
                  src="/images/home/left_prod.png"
                  alt="About Us"
                  className="h-full w-full object-contain"
                  style={{ willChange: "transform" }}
                  animate={leftProductAnimation}
                  transition={reduceMotion ? undefined : railTransition}
                />
              </div>

              {/* Right product — travels right → left along the opposite rail. */}
              <div className="absolute top-[10%] right-[8%] h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                <motion.img
                  src="/images/home/right_prod.png"
                  alt="About Us"
                  className="h-full w-full object-contain"
                  style={{ willChange: "transform" }}
                  animate={rightProductAnimation}
                  transition={reduceMotion ? undefined : railTransition}
                />
              </div>
            </div>
          </div>

          {/* Right column — company copy */}
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: false, amount: 0.3 }}
            variants={reduceMotion ? undefined : containerVariants}
          >
            {/* "Since 1994" badge — small UI accent, not a bullet list */}
            <motion.div
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="inline-flex items-center gap-2 rounded-full border border-[#E53935]/20 bg-[#E53935]/5 px-4 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#E53935]" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#E53935]">
                Since 1994 · 30+ Years of Trust
              </span>
            </motion.div>

            <motion.h3
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="mt-5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
            >
              Trusted Traders. Trusted Quality.
            </motion.h3>

            <motion.p
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="mt-6 text-base font-medium leading-relaxed text-zinc-800 sm:text-lg"
            >
              For over three decades, we have been a name synonymous with
              reliability and quality in the non-ferrous metal trading industry.
            </motion.p>

            <motion.p
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="mt-5 text-sm leading-relaxed text-zinc-600 sm:text-base"
            >
              Our journey began in 1994 as Shree Arihant Metal Traders, and in
              2021, we evolved into Shree Labh Dhatu Traders Pvt. Ltd. — a
              transformation that reflects our growth, but not our core values.
              What has remained unchanged since day one is our unwavering
              commitment to quality.
            </motion.p>

            <motion.p
              variants={reduceMotion ? undefined : fadeUpVariants}
              className="mt-5 text-sm leading-relaxed text-zinc-600 sm:text-base"
            >
              We specialize in copper plates, brass plates, copper wires, and a
              range of allied metal products, serving businesses that depend on
              consistent, high-grade material for their operations.
            </motion.p>

            <motion.p
              variants={reduceMotion ? undefined : fadeUpVariants} 
              className="mt-8 border-l-2 border-[#E53935] pl-5 font-serif text-lg italic leading-snug text-[#E53935]"
            >
              Trust is earned, plate by plate, order by order — that's the
              principle we continue to build on today.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
