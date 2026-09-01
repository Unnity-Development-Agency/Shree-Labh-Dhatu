"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TYPE_WORDS = ["COPPER SOLUTIONS", "BRASS SOLUTIONS"];

const ANNOUNCEMENTS = [
  "Pan-India delivery network now live",
  "Now taking custom specifications",
  "Now serving 500+ clients across India",
  "Zero-defect quality commitment",
  "Get a quote for bulk copper & brass orders",
];

const EASE = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export default function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const [wordIndex, setWordIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 45, damping: 20, mass: 0.6 });
  const springY = useSpring(mvY, { stiffness: 45, damping: 20, mass: 0.6 });

  // Typewriter effect
  useEffect(() => {
    const currentWord = TYPE_WORDS[wordIndex];

    if (!deleting && subIndex === currentWord.length) {
      const pause = setTimeout(() => setDeleting(true), 1500);
      return () => clearTimeout(pause);
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setWordIndex((prev) => (prev + 1) % TYPE_WORDS.length);
      return undefined;
    }

    const speed = deleting ? 45 : 95;
    const step = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(step);
  }, [subIndex, deleting, wordIndex]);

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => setCursorOn((v) => !v), 500);
    return () => clearInterval(blink);
  }, []);

  // Mouse parallax
  useEffect(() => {
    if (reduceMotion) return undefined;
    const handleMove = (e) => {
      const relX = (e.clientX / window.innerWidth - 0.5) * 2;
      const relY = (e.clientY / window.innerHeight - 0.5) * 2;
      mvX.set(relX * 18);
      mvY.set(relY * 12);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [reduceMotion, mvX, mvY]);

  // GSAP: ambient video zoom + scroll fade
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (videoRef.current && !reduceMotion) {
        gsap.to(videoRef.current, {
          scale: 1.16,
          duration: 18,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      if (contentRef.current && !reduceMotion) {
        gsap.to(contentRef.current, {
          yPercent: -18,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  const typedWord = TYPE_WORDS[wordIndex].slice(0, subIndex);
  const marqueeItems = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <>
      <style>{`
        @keyframes stratum-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .stratum-marquee-track {
          animation: stratum-marquee 32s linear infinite;
        }
        .stratum-marquee-group:hover .stratum-marquee-track {
          animation-play-state: paused;
        }
        @keyframes stratum-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .stratum-animated-gradient {
          background: linear-gradient(120deg, rgba(229,57,53,0.28), rgba(15,23,42,0) 45%, rgba(229,57,53,0.16) 85%);
          background-size: 220% 220%;
          animation: stratum-gradient-shift 16s ease-in-out infinite;
          mix-blend-mode: soft-light;
        }
      `}</style>

      <section
        ref={sectionRef}
        id="hero"
        aria-label="Introduction"
        className="relative flex sm:h-screen w-full items-center overflow-hidden bg-slate-950"
      >
        {/* Background video + overlays */}
        <div className="absolute inset-0">
          <motion.div
            style={{ x: springX, y: springY }}
            className="absolute inset-[-6%]"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster="/images/hero-poster.jpg"
              className="h-full w-full object-cover"
            >
              <source src="/videos/hero-loop-2.mp4" type="video/mp4" />
            </video>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/55 to-slate-950/92" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/40" />
          <div className="stratum-animated-gradient absolute inset-0" />
        </div>

        {/* Left vertical scroll indicator */}
        <div className="pointer-events-none absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex lg:left-10">
          <span
            className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/60"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll
          </span>
          <span className="relative h-24 w-px overflow-hidden bg-white/20">
            <motion.span
              className="absolute left-0 top-0 h-8 w-px bg-[#E53935]"
              animate={reduceMotion ? {} : { y: [0, 64, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </span>
        </div>

        {/* Main content */}
        <motion.div
          ref={contentRef}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative sm:top-12 z-10 sm:left-4 mx-auto w-full max-w-[1600px] px-4 pb-28 pt-24 sm:px-10 lg:px-14 lg:pt-0"
        >
          <div className="max-w-4xl">
            <motion.p
              variants={itemVariants}
              className="mb-5 text-xs font-semibold uppercase tracking-[0.4em] text-white/70 sm:text-sm"
            >
              PRECISE . RELIABLE . BUILT TO LAST
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="font-black leading-[0.95] tracking-tight text-white text-[clamp(1.65rem,5.2vw,3.4rem)]"
            >
              Leading Copper and Brass{" "}
              <span className="block text-[#E53935]">
                {/* {typedWord}{" "} */} supplier across India
                {/* <span className={cursorOn ? "opacity-100" : "opacity-0"}>
                  |
                </span> */}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
            >
              India's trusted supplier of high-conductivity electrical wires,
              corrosion-resistant brass plates, and custom-engineered
              non-ferrous metal components.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex items-center gap-4"
            >
              <motion.a
                variants={itemVariants}
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#E53935] px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_16px_40px_-14px_rgba(229,57,53,0.75)] transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                Explore Operations
                <Image
                  src={"/images/btn-arrow.png"}
                  alt="Arrow Right"
                  width={16}
                  height={16}
                  className="h-4 w-4 brightness-0 invert transition-transform duration-300 group-hover:-rotate-25"
                />
                {/* <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" /> */}
              </motion.a>

              <motion.a
                variants={itemVariants}
                href="#about"
                className="hidden sm:inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:shadow-[0_0_36px_-6px_rgba(229,57,53,0.6)]"
              >
                Our Story
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating news bar */}
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          className="absolute bottom-0 z-20 overflow-hidden  bg-white shadow-[0_-24px_60px_-24px_rgba(0,0,0,0.4)] "
        >
          <div className="flex items-stretch">
            <div
              className="flex shrink-0 items-center bg-[#E53935] py-4 pl-6 pr-9 sm:pl-8 sm:pr-12"
              style={{ clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)" }}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
                What&apos;s New
              </span>
            </div>

            <div className="stratum-marquee-group relative flex-1 overflow-hidden py-4">
              <div className="stratum-marquee-track flex w-max items-center gap-10 pl-8 pr-8">
                {marqueeItems.map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className="flex items-center gap-10 whitespace-nowrap text-sm font-medium text-slate-700"
                  >
                    {item}
                    <span className="text-[#E53935]">•</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
