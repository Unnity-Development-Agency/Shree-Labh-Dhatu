"use client";

import { Component, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import styles from "./Hero.module.css";

const MetalScene = dynamic(() => import("./HomeMetalScene"), { ssr: false });

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onStatus("unavailable"); }
  render() { return this.state.failed ? null : this.props.children; }
}
const metals = [
  {
    name: "Copper",
    code: "Cu",
    color: "#c78761",
    href: "/copper",
    note: "Conductivity, in its element.",
  },
  {
    name: "Brass",
    code: "Cu / Zn",
    color: "#c4ae76",
    href: "/brass",
    note: "Precision with a warmer edge.",
  },
  {
    name: "Aluminium",
    code: "Al",
    color: "#c7d0d1",
    href: "/aluminium",
    note: "Less weight. More possibility.",
  },
  {
    name: "Stainless Steel",
    code: "Fe / Cr",
    color: "#9caeb8",
    href: "/stainless-steel",
    note: "Strength that holds its finish.",
  },
];

export default function Hero() {
  const surfaceRef = useRef(null);
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [sceneStatus, setSceneStatus] = useState("loading");
  const [revealed, setRevealed] = useState(false);
  const metal = metals[selected];

  useEffect(() => {
    if (sceneStatus === "loading") return;
    let active = true;
    // Reveal the completed frame with its final font metrics, not the fallback.
    Promise.resolve(document.fonts?.ready).then(() => {
      if (active) setRevealed(true);
    });
    return () => { active = false; };
  }, [sceneStatus]);

  useEffect(() => {
    if (revealed) return;
    const timeout = window.setTimeout(() => {
      setSceneStatus((status) => status === "loading" ? "unavailable" : status);
      setRevealed(true);
    }, 12000);
    return () => window.clearTimeout(timeout);
  }, [revealed]);

  return (
    <>
    {!revealed && (
      <div className={styles.loader} data-home-loader role="status" aria-live="polite">
        <div className={styles.loaderMark} aria-hidden="true"><span /><span /><span /></div>
        <span className={styles.loaderBrand}>Shree Labh Dhatu</span>
        <span className={styles.loaderCaption}>Preparing your metal showroom</span>
        <span className={styles.loaderTrack} aria-hidden="true"><span /></span>
      </div>
    )}
    <noscript><style>{`[data-home-loader]{display:none!important}html:has([data-home-loader]){overflow:auto!important}.home-page:has(>[data-home-loader])>*{visibility:visible!important}`}</style></noscript>
    <section
      ref={surfaceRef}
      className={styles.hero}
      id="hero"
      aria-labelledby="home-hero-title"
      style={{ "--metal-accent": metal.color }}
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.scene} aria-hidden="true">
        <SceneBoundary onStatus={setSceneStatus}>
        <MetalScene
          surfaceRef={surfaceRef}
          selected={selected}
          expanded={expanded}
          paused={paused}
          resetKey={resetKey}
          onStatus={setSceneStatus}
        />
        </SceneBoundary>
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.topline}>
        <span>
          Shree Labh Dhatu <span className={styles.muted}>/ Since 1994</span>
        </span>
        <span className={styles.edition}>Non-ferrous & stainless metals</span>
      </div>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          <span /> Stock. Specification. Supply.
        </p>
        <h1 id="home-hero-title">
          Leading Copper and Brass
          <br />
          supplier <em>across&apos;India</em>
        </h1>
        <p className={styles.description}>
          India&apos;s trusted supplier of high-conductivity electrical wires,
          corrosion-resistant brass plates, and custom-engineered non-ferrous
          metal components.
        </p>
        <Link
          href={metal.href}
          className={`site-button site-button--light ${styles.explore}`}
        >
          Explore {metal.name}
          <ArrowUpRight size={19} aria-hidden="true" />
        </Link>
        <Link
          href="/contact"
          className={`site-button site-button--on-dark ${styles.enquiry}`}
        >
          Discuss a requirement <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.specimen}>
        <span className={styles.specimenNumber}>
          0{selected + 1} <span>/ 04</span>
        </span>
        <div>
          <span className={styles.specimenName}>{metal.name}</span>
          <span className={styles.specimenNote}>{metal.note}</span>
        </div>
      </div>
      <div className={styles.stage} data-metal-stage aria-hidden="true">
        {sceneStatus === "unavailable" && (
          <div className={styles.fallback}>
            <img src="/images/home/Copper-coil.png" alt="" />
          </div>
        )}
      </div>
      <div className={styles.tools} data-metal-tools>
        <span className={styles.interactionHint}>
          {sceneStatus === "ready"
            ? "Move to illuminate · Drag to turn"
            : "Material study / Coil & sheet"}
        </span>
        {sceneStatus === "ready" && (
          <div className={styles.toolButtons}>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              aria-pressed={expanded}
            >
              {expanded ? "Gather layers" : "Separate layers"}
              <span aria-hidden="true">{expanded ? "−" : "+"}</span>
            </button>
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              aria-label={
                paused ? "Resume metal animation" : "Pause metal animation"
              }
              aria-pressed={paused}
            >
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
            <button
              type="button"
              onClick={() => {
                setResetKey(resetKey + 1);
                setExpanded(false);
              }}
              aria-label="Reset metal view"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        )}
      </div>
      <div className={styles.bottom}>
        <div
          className={styles.materials}
          role="group"
          aria-label="Choose hero metal"
        >
          {metals.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              className={selected === index ? styles.activeMaterial : ""}
              style={{ "--swatch": item.color }}
            >
              <span className={styles.materialCode}>{item.code}</span>
              <span>{item.name}</span>
              <span className={styles.materialDot} />
            </button>
          ))}
        </div>
        <a className={styles.scrollLink} href="#materials">
          Discover the range <ArrowDown size={16} aria-hidden="true" />
        </a>
      </div>
      <span className={styles.verticalLabel} aria-hidden="true">
        METAL / IN CONTINUOUS FORM
      </span>
    </section>
    </>
  );
}
