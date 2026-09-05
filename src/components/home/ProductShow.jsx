"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Expand, Pause, Play, X } from "lucide-react";
import { MATERIALS } from "@/data/materialShowcase";
import MaterialWires from "./MaterialWires";
import styles from "./ProductShow.module.css";

const ORDER = ["copper", "brass", "aluminium", "stainlessSteel"];
const COLORS = { copper: "#db8c66", brass: "#d5b366", aluminium: "#bdd0dc", stainlessSteel: "#a4b8cb" };

export default function MaterialsShowcase() {
  const [selected, setSelected] = useState("copper");
  const [productIndex, setProductIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const sectionRef = useRef(null), dialogRef = useRef(null);
  const material = MATERIALS[selected], product = material.products[productIndex];
  const title = product.name.includes(material.name) ? product.name : `${material.name} ${product.name}`;
  const route = selected === "stainlessSteel" ? "stainless-steel" : selected;
  const hasSpecifications = !(selected === "copper" && product.name === "Rods");
  const specificationHref = hasSpecifications ? `/${route}#${product.sectionId || `${route}-${product.name.toLowerCase().replaceAll(" ", "-")}`}` : `/${route}`;
  useEffect(() => {
    if (!imageOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [imageOpen]);
  const step = direction => setProductIndex(index => (index + direction + material.products.length) % material.products.length);
  return (
    <section id="materials" ref={sectionRef} className={styles.section} style={{ "--material-color": COLORS[selected] }} aria-labelledby="materials-heading">
      <div className={styles.wires}><MaterialWires hostRef={sectionRef} color={COLORS[selected]} paused={paused} /></div>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <div><p className={styles.eyebrow}><span /> THE MATERIAL COLLECTION</p><h2 id="materials-heading">Every project starts<br />with <em>the right metal.</em></h2></div>
          <p className={styles.intro}>Four metals. Possibilities in every form.<br />Choose your material and find the right fit for your next project.</p>
        </header>
        <div className={styles.workbench}>
          <aside className={styles.selection} aria-label="Product selection">
            <div className={styles.selectionHeading}><span>FIND YOUR MATERIAL</span><span>01 — 02</span></div>
            <label className={styles.field} htmlFor="showcase-metal"><span><b>01</b> Choose metal</span><div className={styles.selectWrap}><select id="showcase-metal" value={selected} onChange={event => { setSelected(event.target.value); setProductIndex(0); }}>{ORDER.map(key => <option key={key} value={key}>{MATERIALS[key].name}</option>)}</select><ChevronDown size={18} aria-hidden="true" /></div></label>
            <label className={styles.field} htmlFor="showcase-form"><span><b>02</b> Choose form <small>{material.products.length} available</small></span><div className={styles.selectWrap}><select id="showcase-form" value={productIndex} onChange={event => setProductIndex(Number(event.target.value))}>{material.products.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}</select><ChevronDown size={18} aria-hidden="true" /></div></label>
            <div className={styles.materialNote}><img src={material.swatch} alt="" width="56" height="56" /><div><strong>{material.name}</strong><p>{material.featured.description}</p></div></div>
            <Link href={`/${route}`} className={`button-splash ${styles.rangeLink}`}>View full {material.name.toLowerCase()} range <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </aside>
          <article id="selected-material-product" className={styles.detail} aria-labelledby="selected-product-title">
            <div className={styles.stage}>
              <div className={styles.stageHeader}><span><i /> {material.name} collection</span><span>{String(productIndex + 1).padStart(2, "0")} / {String(material.products.length).padStart(2, "0")}</span></div>
              <span className={styles.watermark} aria-hidden="true">{selected === "stainlessSteel" ? "STEEL" : material.name.toUpperCase()}</span>
              <button className={styles.imageButton} type="button" onClick={() => { setImageOpen(true); dialogRef.current.showModal(); }} aria-label={`Enlarge ${title} image`}><img key={product.image} src={product.image} alt={title} width="480" height="360" /><span className={styles.expand}><Expand size={14} aria-hidden="true" /> Enlarge image</span></button>
              <div className={styles.stageFooter}><span>Explore the forms</span><div><button type="button" onClick={() => step(-1)} aria-label="Previous product"><ArrowLeft size={18} /></button><button type="button" onClick={() => step(1)} aria-label="Next product"><ArrowRight size={18} /></button></div></div>
            </div>
            <div className={styles.copy}>
              <div aria-live="polite" aria-atomic="true"><p className={styles.eyebrow}>YOUR SELECTION</p><h3 id="selected-product-title">{title}</h3><p className={styles.description}>{product.description || material.featured.description}</p></div>
              <div className={styles.actions}><Link href={specificationHref} className={`button-splash ${styles.primary}`}>{hasSpecifications ? "Explore specifications" : "Explore copper range"} <ArrowUpRight size={18} aria-hidden="true" /></Link><Link href={`/contact?product=${encodeURIComponent(title)}`} className={`button-splash ${styles.secondary}`}>Enquire about this product <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
            </div>
          </article>
        </div>
        <div className={styles.bottom}><p><span /> Selected with purpose. Supplied with care.</p><button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={13} /> : <Pause size={13} />}{paused ? "Resume background motion" : "Pause background motion"}</button></div>
      </div>
      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="product-preview-title" onClose={() => setImageOpen(false)} onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}><div className={styles.dialogContent}><header><h3 id="product-preview-title">{title}</h3><button type="button" onClick={() => dialogRef.current.close()} aria-label="Close image preview"><X size={20} /></button></header><img src={product.image} alt={title} width="900" height="650" /></div></dialog>
    </section>
  );
}
