"use client";

import React from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
} from "framer-motion";
import { homeData } from "../../data/homeData";

const EASE = [0.22, 1, 0.36, 1];
const INK_EASE = [0.65, 0, 0.35, 1]; // slow, deliberate "pen" easing
const RED = "#E53935";

/* ------------------------------------------------------------------ */
/*  Each icon is a small set of strokes drawn ONE AFTER ANOTHER        */
/*  (staggered), like a pen sketching it — main shape first, then      */
/*  details. Feels premium/hand-drawn rather than an instant reveal.   */
/* ------------------------------------------------------------------ */

// India outline traced from the real map (viewBox 0 0 241 260) — kept as a
// stroke path (fill: none) so it draws in with the same pen animation as
// every other icon, rather than appearing as a filled shape.
const INDIA_OUTLINE = `M227.822,63.335 L215.884,64.816 L195.815,80.809 L197.159,87.984 L179.343,90.9
 L171.988,87.529 L170.643,79.845 L163.422,80.02 L165.128,93.27 L146.79,93.703
 L121.821,86.002 L100.271,74.179 L106.398,62.15 L90.884,51.603 L89.61,41.434
 L93.782,43.975 L98.261,41.155 L93.118,31.532 L102.741,22.739 L104.772,15.626
 L97.113,12.953 L82.998,15.439 L68.397,2 L52.291,3.126 L47.145,9.69 L58.727,18.336
 L55.858,21.297 L52.997,21.914 L52.814,35.434 L63.024,41.67 L34.41,80.535
 L22.268,79.373 L14.591,89.807 L26.46,109.512 L17.324,113.75 L7.186,112.018
 L2.289,116.552 L10.581,125.209 L9.784,132.863 L23.954,145.028 L24.25,144.8
 L37.85,140.7 L39.582,147.898 L39.855,169.221 L58.216,223.805 L62.682,232.394
 L68.741,252.441 L73.594,258 L82.205,257.339 L83.845,251.986 L98.311,235.424
 L98.311,233.897 L98.015,226.243 L98.357,225.15 L102.366,211.822 L101.957,211.572
 L102.116,211.185 L102.366,211.822 L102.207,211.048 L100.157,197.766 L101.957,191.866
 L134.397,168.287 L140.16,160.633 L143.737,154.984 L153.578,152.455 L162.076,137.579
 L167.497,134.252 L175.448,136.394 L168.5,105.412 L168.181,93.908 L177.999,95.798
 L179.594,102.428 L184.265,104.774 L200.826,105.002 L199.186,109.284 L200.621,116.712
 L204.198,130.198 L210.167,121.153 L208.959,113.112 L214.745,113.727 L218.96,99.625
 L222.879,88.44 L234.451,81.128 L238.711,74.794 Z`;

// Gear (Customized Dimensions) — outer teeth path + inner circle, split into
// two strokes so it draws in with the same pen animation as every other
// icon instead of a standalone CSS spin.
const GEAR_TEETH = `M118 48 L122 34 L138 34 L142 48
   L154 54 L166 46 L178 58 L170 70
   L176 82 L190 86 L190 102 L176 106
   L170 118 L178 130 L166 142 L154 134
   L142 140 L138 154 L122 154 L118 140
   L106 134 L94 142 L82 130 L90 118
   L84 106 L70 102 L70 86 L84 82
   L90 70 L82 58 L94 46 L106 54 Z`;
const GEAR_CIRCLE = `M110,94 A20,20 0 1,1 150,94 A20,20 0 1,1 110,94`;

const ICONS = {
  // 1. Pan India Availability — real India outline + two location pins
  // NOTE: this icon uses its own viewBox (0 0 241 260) to match the traced map
  indiaMap: {
    viewBox: "0 0 241 260",
    strokes: [
      INDIA_OUTLINE,
      `M110,68 C125,68 137,79 137,94 C137,114 110,140 110,140 C110,140 83,114 83,94
       C83,79 95,68 110,68 Z M110,103 A9,9 0 1,0 110,85 A9,9 0 1,0 110,103`,
      `M60,144 C69,144 76,151 76,160 C76,172 60,190 60,190 C60,190 44,172 44,160
       C44,151 51,144 60,144 Z M60,165 A5,5 0 1,0 60,155 A5,5 0 1,0 60,165`,
    ],
  },

  // 2. Customized Dimensions — gear, same viewBox as the original artwork
  // (52 16 156 156), now drawn stroke-by-stroke like every other icon.
  gear: {
    viewBox: "52 16 156 156",
    strokeWidth: 7,
    strokes: [GEAR_TEETH, GEAR_CIRCLE],
  },

  // 3. Multiple Purity Options — layered sheets + percent badge, converted
  //    into our stroke-draw system (viewBox cropped tight around the artwork,
  //    same treatment as the India map / coin stack, so it fills its box
  //    the same way instead of sitting small in empty space)
  papersPercent: {
    viewBox: "15 25 238 208",
    strokeWidth: 6,
    strokes: [
      `M30 158 L100 178 L206 144 L206 132 L100 166 L30 146 Z`,
      `M30 134 L100 154 L206 120 L206 108 L100 142 L30 122 Z`,
      `M30 110 L100 130 L206 96 L130 40 L60 62 Z
       M30 110 L60 62 L130 40 L206 96 L100 130 Z`,
      `M134,166 A52,52 0 1,1 238,166 A52,52 0 1,1 134,166
       M166,188 L206,146
       M176,150 A7,7 0 1,1 162,150 A7,7 0 1,1 176,150
       M210,184 A7,7 0 1,1 196,184 A7,7 0 1,1 210,184`,
    ],
  },

  // 4. Tested & Verified Material — rendered via <TestedVerifiedIcon /> below
  //    (kept out of this system; uses the exact provided SVG/CSS as-is)

  // 5. High Conductivity Copper — exact reference icon (coin stack + bolt),
  //    converted into our stroke-draw system (viewBox 0 0 512 512)
  coinStack: {
    // tightly cropped around the actual shape (original was 0 0 512 512 with
    // the artwork sitting only in the top-left, which made it render small
    // next to the India map — which fills its own viewBox edge-to-edge)
    viewBox: "55 0 350 340",
    strokeWidth: 8,
    strokes: [
      `M80,60 A95,35 0 1,1 270,60 A95,35 0 1,1 80,60`,
      `M130,60 A45,16 0 1,1 220,60 A45,16 0 1,1 130,60`,
      `M80 60 C80 70 80 80 80 90 C80 110 122 128 175 128 C228 128 270 110 270 90 L270 60
       M80 90 C80 100 80 110 80 120 C80 140 122 158 175 158 C228 158 270 140 270 120 L270 90
       M80 120 C80 130 80 140 80 150 C80 170 122 188 175 188 C228 188 270 170 270 150 L270 120`,
      `M80 150 C80 160 80 170 80 180 C80 200 122 218 175 218 C228 218 270 200 270 180 L270 150
       M80 180 C80 190 80 200 80 210 C80 230 122 248 175 248 C215 248 250 237 263 222
       M80 210 C80 220 80 230 80 240 C80 260 122 278 175 278 C200 278 224 272 240 262`,
      `M290 195 L365 155 L330 225 L385 225 L300 320 L325 240 L275 240 Z`,
    ],
  },
};

/* ------------------------------------------------------------------ */

const iconGroupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.02 } },
};

const strokeVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.45, ease: INK_EASE },
  },
};

const AnimatedIcon = ({
  strokes,
  accents = [],
  viewBox = "0 0 100 100",
  strokeWidth = 3.2,
  reduceMotion,
}) => (
  <motion.svg
    viewBox={viewBox}
    className="h-full w-full"
    xmlns="http://www.w3.org/2000/svg"
    initial={reduceMotion ? false : "hidden"}
    whileInView={reduceMotion ? undefined : "visible"}
    viewport={{ once: false, amount: 0.5 }}
    variants={reduceMotion ? undefined : iconGroupVariants}
  >
    <g
      fill="none"
      stroke={RED}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {strokes.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          variants={reduceMotion ? undefined : strokeVariants}
        />
      ))}
    </g>
    {/* small floating accents (bubbles / sparks) — loop while in view */}
    {accents.map((a, i) => (
      <motion.circle
        key={i}
        cx={a.cx}
        cy={a.cy}
        r={a.r}
        fill={RED}
        stroke="none"
        initial={{ opacity: 0, y: 0 }}
        whileInView={
          reduceMotion
            ? undefined
            : { opacity: [0, 1, 0], y: [0, -a.rise || -20] }
        }
        viewport={{ once: false, amount: 0.5 }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          repeatDelay: 0.5,
          delay: a.delay || 0,
          ease: "easeInOut",
        }}
      />
    ))}
  </motion.svg>
);

/* ------------------------------------------------------------------ */
/*  Tested & Verified Material — kept exactly as provided (same paths,   */
/*  same CSS keyframe animation/timings), just wrapped as JSX.           */
/* ------------------------------------------------------------------ */

const TestedVerifiedIcon = () => (
  <svg
    viewBox="0 0 512 512"
    className="h-full w-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{`
      .outer-shield { stroke-dasharray: 900; stroke-dashoffset: 900; animation: draw 0.7s ease forwards; }
      .inner-shield { stroke-dasharray: 700; stroke-dashoffset: 700; animation: draw 0.7s ease forwards 0.18s; }
      .check { stroke-dasharray: 140; stroke-dashoffset: 140; animation: draw 0.3s ease forwards 0.65s; }
      .flask-body { stroke-dasharray: 500; stroke-dashoffset: 500; animation: draw 0.6s ease forwards 0.3s; }
      .bubble { opacity: 0; animation: bubble 2s ease-in-out infinite; }
      .bubble:nth-child(1) { animation-delay: 1s; }
      .bubble:nth-child(2) { animation-delay: 1.2s; }
      .bubble:nth-child(3) { animation-delay: 1.4s; }
      @keyframes draw { to { stroke-dashoffset: 0; } }
      @keyframes bubble {
        0% { opacity: 0; transform: translateY(0); }
        30% { opacity: 1; }
        100% { opacity: 0; transform: translateY(-20px); }
      }
    `}</style>
    <g
      fill="none"
      stroke="#E30613"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        className="outer-shield"
        d="M195 45 L80 75 L80 210 C80 300 130 350 195 385 C260 350 310 300 310 210 L310 75 Z"
      />
      <path
        className="inner-shield"
        d="M195 80 L115 102 L115 205 C115 275 155 315 195 345 C235 315 275 275 275 205 L275 102 Z"
      />
      <path className="check" d="M150 195 L180 225 L245 155" />
      <path
        className="flask-body"
        d="M355 165 L420 165 M365 165 L365 210 L320 300 C312 318 325 335 345 335 L430 335 C450 335 463 318 455 300 L410 210 L410 165"
      />
      <circle
        className="bubble"
        cx="345"
        cy="300"
        r="4"
        fill="#E30613"
        stroke="none"
      />
      <circle
        className="bubble"
        cx="380"
        cy="310"
        r="3"
        fill="#E30613"
        stroke="none"
      />
      <circle
        className="bubble"
        cx="410"
        cy="295"
        r="3.5"
        fill="#E30613"
        stroke="none"
      />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */

// The icon above uses plain CSS @keyframes, which — unlike the framer-motion
// icons — play once on mount regardless of scroll position. This wrapper
// watches the viewport and remounts the SVG (via a changing `key`) each time
// it re-enters view, so the CSS animation actually restarts, matching the
// scroll-triggered, replay-on-re-entry behaviour of every other icon.
const AnimatedTestedVerifiedIcon = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  const [playKey, setPlayKey] = React.useState(0);
  const wasInView = React.useRef(false);

  React.useEffect(() => {
    if (inView && !wasInView.current) {
      setPlayKey((k) => k + 1);
    }
    wasInView.current = inView;
  }, [inView]);

  return (
    <div ref={ref} className="h-full w-full">
      <TestedVerifiedIcon key={playKey} />
    </div>
  );
};

/* ------------------------------------------------------------------ */

const headingGroupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.56, ease: EASE } },
};

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.096, delayChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: EASE } },
};

// all icons rendered at the same size (matches the India map icon)
const ICON_SIZE = ["max-w-28", "max-w-28", "max-w-28", "max-w-28", "max-w-28"];

// index 3 (Tested & Verified Material) is rendered via its own standalone
// component below, NOT through this stroke-draw lookup table — left as a
// `null` placeholder here.
const ICON_ORDER = [
  ICONS.indiaMap,
  ICONS.gear,
  ICONS.papersPercent,
  null, // index 3 = Tested & Verified Material, rendered via <TestedVerifiedIcon />
  ICONS.coinStack,
];

/* ------------------------------------------------------------------ */
/*  Premium 3D tilt card — outer motion.div handles the scroll-in        */
/*  fade/slide (cardVariants, staggered by the parent grid). The inner   */
/*  motion.div tracks the mouse to tilt on rotateX/rotateY (spring-      */
/*  smoothed), lifts + scales slightly, and gets a soft red-tinted glow  */
/*  shadow plus a subtle moving highlight — a classic "premium" tilt     */
/*  card effect. Falls back to a plain static card when the user has     */
/*  requested reduced motion.                                            */
/* ------------------------------------------------------------------ */

const TiltCard = ({ reduceMotion, children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 220,
    damping: 22,
    mass: 0.6,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 220,
    damping: 22,
    mass: 0.6,
  });

  // subtle highlight that follows the cursor, for the "premium glass" feel
  const glowX = useTransform(x, [-0.5, 0.5], ["10%", "90%"]);
  const glowY = useTransform(y, [-0.5, 0.5], ["10%", "90%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (reduceMotion) {
    return (
      <div className="group flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-10 text-center shadow-sm">
        {children}
      </div>
    );
  }

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.045, z: 20 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative flex flex-col items-center gap-3 overflow-hidden  px-4 py-10 text-center shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-shadow duration-300 ease-out hover:shadow-[0_32px_60px_-12px_rgba(229,57,53,0.4)] cursor-pointer"
      >
        {/* cursor-tracking sheen — bumped up a bit so the tilt reads clearly on hover */}
        <motion.div
          aria-hidden
          className="cursor-pointer absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(229,57,53,0.22), transparent 55%)`,
          }}
        />
        {/* thin glowing edge on hover */}
        <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-[#E53935]/35" />

        <div style={{ transform: "translateZ(40px)" }} className="contents">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Section background: tracks scroll progress through the section and   */
/*  interpolates from the flat neutral grey to a deeper red-tinted tone  */
/*  — so the whole "Why Choose Us" backdrop gradually deepens as it      */
/*  enters/crosses the viewport, independent of card hover. Cards keep   */
/*  their own white surface + hover glow untouched.                      */
/* ------------------------------------------------------------------ */

const SECTION_BG_START = "#f5f5f5"; // neutral, section just entering
const SECTION_BG_MID = "#f4dbda"; // new — soft mid-point tone
const SECTION_BG_END = "#eec2c0"; // moved here from old MID — final, less-bold tints

const WhyChooseUS = () => {
  const reduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // 0 = section top hits viewport bottom, 1 = section bottom leaves viewport top
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [SECTION_BG_START, SECTION_BG_MID, SECTION_BG_END],
  );

  return (
    <motion.section
      ref={sectionRef}
      style={reduceMotion ? undefined : { backgroundColor }}
      className={`w-full px-6 py-20 sm:py-24 ${
        reduceMotion ? "bg-[#f5f5f5]" : ""
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center">
        {/* Eyebrow + heading */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.2 }}
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

        {/* Card grid */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.15 }}
          variants={reduceMotion ? undefined : gridVariants}
          className="mt-14 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5 "
        >
          {homeData.map((item, index) => (
            <motion.div
              key={item.id}
              variants={reduceMotion ? undefined : cardVariants}
            >
              <TiltCard reduceMotion={reduceMotion}>
                <div
                  className={`w-full ${ICON_SIZE[index % ICON_SIZE.length]} aspect-[241/260] p-4`}
                >
                  {index === 3 ? (
                    <AnimatedTestedVerifiedIcon />
                  ) : (
                    (() => {
                      const icon = ICON_ORDER[index % ICON_ORDER.length];
                      const isPlain = Array.isArray(icon);
                      const strokes = isPlain ? icon : icon.strokes;
                      const viewBox = isPlain ? "0 0 100 100" : icon.viewBox;
                      const strokeWidth = isPlain
                        ? 3.2
                        : icon.strokeWidth || 3.2;
                      const accents = isPlain ? [] : icon.accents || [];
                      return (
                        <AnimatedIcon
                          strokes={strokes}
                          accents={accents}
                          viewBox={viewBox}
                          strokeWidth={strokeWidth}
                          reduceMotion={reduceMotion}
                        />
                      );
                    })()
                  )}
                </div>

                <h3 className="text-lg font-bold text-zinc-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  {item.subtitle}
                </p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyChooseUS;
