"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play, ShieldCheck, Handshake, Layers } from "lucide-react";
import styles from "./AboutUs.module.css";

const values = [
  { id: "quality", label: "Our commitment", title: "Quality, without compromise.", description: "Consistent, high-grade material for businesses that depend on it. Our commitment to quality has remained unchanged since day one.", image: "/images/home/Copper-coil.png", material: "Copper", detail: "The standard we stand by" },
  { id: "trust", label: "Our foundation", title: "Trust, built over time.", description: "From Shree Arihant Metal Traders in 1994 to Shree Labh Dhatu today. Three decades of reliability, built one relationship at a time.", image: "/images/home/Brass-coil.png", material: "Brass", detail: "Since 1994" },
  { id: "range", label: "Our expertise", title: "The right metal. Every time.", description: "Copper plates, brass plates, copper wires, and allied metal products. A considered range for the businesses we serve.", image: "/images/home/Aluminium-coil.png", material: "Aluminium", detail: "Expertise in every order" },
];

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getServerReducedMotion = () => true;
const valueIcons = [ShieldCheck, Handshake, Layers];

// Keep pointer feedback separate from the outer carousel transforms.
function tiltCard(event) {
  if (event.pointerType !== "mouse" || window.matchMedia(motionQuery).matches) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--tilt-x", `${-(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 3}deg`);
  event.currentTarget.style.setProperty("--tilt-y", `${(event.clientX - bounds.left - bounds.width / 2) / bounds.width * 3}deg`);
}
function resetTilt(event) {
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
}

export default function AboutUs() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const root = useRef(null);
  const touch = useRef(null);
  const inView = useInView(root, { amount: 0.25 });
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion, getServerReducedMotion);
  const running = !reducedMotion && !hovered && !focused && !paused && !hidden && inView;
  const move = (direction) => setActive((current) => (current + direction + values.length) % values.length);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setActive((current) => (current + 1) % values.length), 5500);
    return () => clearInterval(timer);
  }, [running, active]);
  return (
    <section id="about" ref={root} className={styles.section} aria-labelledby="story-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}><span /> OUR STORY</p>
          <p className={styles.since}>EST. 1994 <span>30+ years of trust</span></p>
          <h2 id="story-heading">Trusted traders.<br /><em>Trusted quality.</em></h2>
          <p className={styles.company}>Shree Labh Dhatu Traders Pvt. Ltd.</p>
          <p className={styles.lead}>For over three decades, we have been a name synonymous with reliability and quality in the non-ferrous metal trading industry.</p>
          <p>Our journey began in 1994 as Shree Arihant Metal Traders, and in 2021, we evolved into Shree Labh Dhatu Traders Pvt. Ltd. — a transformation that reflects our growth, but not our core values. What has remained unchanged since day one is our unwavering commitment to quality.</p>
          <p>We specialize in copper plates, brass plates, copper wires, and a range of allied metal products, serving businesses that depend on consistent, high-grade material for their operations.</p>
          <blockquote>“Trust is earned, plate by plate, order by order.”<span>The principle we continue to build on today.</span></blockquote>
          <a href="#materials" className={`site-button ${styles.cta}`}>Explore our materials <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
        <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Our values"
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
          onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }}>
          <div className={styles.stage} onTouchStart={(event) => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
            onTouchCancel={() => { touch.current = null; }}
            onTouchEnd={(event) => { if (!touch.current) return; const dx = event.changedTouches[0].clientX - touch.current.x; const dy = event.changedTouches[0].clientY - touch.current.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); touch.current = null; }}>
            {values.map((value, index) => {
              const offset = (index - active + values.length) % values.length;
              const Icon = valueIcons[index];
              return <article key={value.id} className={styles.card} data-position={offset === 0 ? "active" : offset === 1 ? "next" : "previous"} aria-hidden={index !== active} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${values.length}: ${value.title}`}>
                <div className={styles.cardSurface} onPointerMove={index === active ? tiltCard : undefined} onPointerLeave={resetTilt}>
                <div className={styles.cardTop}><span><Icon size={17} aria-hidden="true" />{value.label}</span><span>0{index + 1}</span></div>
                <div className={styles.art}><span className={styles.material}>{value.material}</span><Image src={value.image} alt="" width={360} height={260} sizes="(max-width: 640px) 75vw, 330px" /></div>
                <div className={styles.cardCopy}><h3>{value.title}</h3><p>{value.description}</p><div className={styles.cardFoot}><span />{value.detail}<a href="/contact" className={`site-button site-button--outline site-icon-button ${styles.cardAction}`} tabIndex={index === active ? 0 : -1} aria-label={`Discuss ${value.material.toLowerCase()} requirements`}><ArrowRight size={16} aria-hidden="true" /></a></div></div>
                </div>
              </article>;
            })}
          </div>
          <div className={styles.controls}>
            <div className={styles.pagination} aria-label="Choose a value">{values.map((value, index) => <button key={value.id} className={styles.dot} aria-label={`Show value ${index + 1}: ${value.title}`} aria-current={active === index ? "true" : undefined} onClick={() => setActive(index)}><span /></button>)}</div>
            <div className={styles.buttons}>
              <button className="site-button site-button--outline site-icon-button" onClick={() => move(-1)} aria-label="Previous value"><ArrowLeft size={18} /></button>
              {!reducedMotion && <button className="site-button site-button--outline site-icon-button" onClick={() => setPaused(!paused)} aria-label={paused ? "Start automatic rotation" : "Pause automatic rotation"}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>}
              <button className="site-button site-button--outline site-icon-button" onClick={() => move(1)} aria-label="Next value"><ArrowRight size={18} /></button>
            </div>
          </div>
          <p className={styles.caption}>Rooted in experience. Guided by our values.</p>
          <span className={styles.srOnly} aria-live={running ? "off" : "polite"} aria-atomic="true">{values[active].title} {active + 1} of {values.length}</span>
        </div>
      </div>
    </section>
  );
}
