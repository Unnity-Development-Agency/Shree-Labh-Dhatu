"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { storyValues } from "@/data/storyValues";
import styles from "./StoryHero.module.css";

const StoryScene = dynamic(() => import("./StoryScene"), { ssr: false });

export default function StoryHero() {
  const [active, setActive] = useState(0);
  const [selection, setSelection] = useState({ index: 0, request: 0 });
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [ready, setReady] = useState(false);
  const select = (index) => {
    const next = (index + storyValues.length) % storyValues.length;
    setActive(next);
    setSelection((current) => ({ index: next, request: current.request + 1 }));
  };
  const value = storyValues[active];

  return (
    <section className={styles.hero} aria-labelledby="our-story-title">
      <div className={styles.topline}>
        <span>SHREE LABH DHATU</span>
        <span>A legacy in metal. Since 1994.</span>
      </div>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span />
            OUR STORY
          </p>
          <h1 id="our-story-title">
            Built on trust.
            <br />
            Shaped by
            <br />
            <em>our values.</em>
          </h1>
          <p className={styles.intro}>
            For over three decades, we have been a name synonymous with
            reliability and quality in the non-ferrous metal trading industry.
          </p>
          <div className={styles.legacy}>
            <span>1994 — TODAY</span>
            <p>
              Our journey began as Shree Arihant Metal Traders. In 2021, we
              became Shree Labh Dhatu Traders Pvt. Ltd. Our name evolved. Our
              commitment to quality stayed constant.
            </p>
            <blockquote>
              “Trust is earned, plate by plate,
              <br />
              order by order.”
            </blockquote>
          </div>
          <Link href="/#materials" className={`site-button ${styles.cta}`}>
            Explore our materials
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div
          className={styles.carousel}
          role="region"
          aria-roledescription="carousel"
          aria-label="Our values"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
          }}
          onKeyDown={(e) => {
            if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
              e.preventDefault();
              select(active + (e.key === "ArrowRight" ? 1 : -1));
            }
          }}
        >
          <div className={styles.scene}>
            <StoryScene
              selection={selection}
              paused={paused || hovered || focused}
              onActive={setActive}
              onReady={setReady}
              onSelect={select}
            />
            {!ready && (
              <article className={styles.fallback}>
                <span>{value.label}</span>
                <h2>{value.title}</h2>
                <p>{value.description}</p>
              </article>
            )}
          </div>
          <div className={styles.controls}>
            <div className={styles.dots}>
              {storyValues.map((item, index) => (
                <button
                  key={item.id}
                  aria-label={`Show ${item.label.toLowerCase()}`}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => select(index)}
                >
                  <span />
                </button>
              ))}
            </div>
            <div className={styles.arrows}>
              <button
                className="site-button site-button--outline site-icon-button"
                aria-label="Previous value"
                onClick={() => select(active - 1)}
              >
                <ArrowLeft size={17} />
              </button>
              <button
                className="site-button site-button--outline site-icon-button"
                aria-label={paused ? "Resume rotation" : "Pause rotation"}
                onClick={() => setPaused(!paused)}
              >
                {paused ? <Play size={15} /> : <Pause size={15} />}
              </button>
              <button
                className="site-button site-button--outline site-icon-button"
                aria-label="Next value"
                onClick={() => select(active + 1)}
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
          <div
            className={styles.activeValue}
            aria-live={paused || focused ? "polite" : "off"}
            aria-atomic="true"
          >
            <span>
              0{active + 1} / 03 — {value.label}
            </span>
            <h2>{value.title}</h2>
            <p>{value.description}</p>
            <Link href="/contact" className={styles.discuss}>
              Let’s talk <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>THREE DECADES. ONE COMMITMENT.</span>
        <span>Quality in every plate. Trust in every order.</span>
      </div>
    </section>
  );
}
