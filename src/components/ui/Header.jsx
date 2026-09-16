"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },

  // {
  //   label: "About Us",
  //   href: "/#about",
  //   submenu: [
  //     { label: "Company Overview", href: "/about/overview" },
  //     { label: "Leadership", href: "/about/leadership" },
  //     { label: "Committees Of The Board", href: "/about/committees" },
  //     { label: "Group Companies", href: "/about/group-companies" },
  //   ],
  // },
  {
    label: "Our Products",
    href: "/copper",
    submenu: [
      { label: "Copper", href: "/copper" },
      { label: "Brass", href: "/brass" },
      { label: "Aluminium", href: "/aluminium" },
      { label: "Stainless Steel", href: "/stainless-steel" },
    ],
  },
  { label: "Our Story", href: "/our-story" },
  { label: "Contact", href: "/contact" },
];

const SCROLL_THRESHOLD = 80;
const EASE = [0.22, 1, 0.36, 1];
const HEADER_HEIGHT = 80;
const MENU_CLOSE_DELAY = 150;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const tickingRef = useRef(false);
  const closeTimerRef = useRef(null);
  const dialogRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        const isScrolled = window.scrollY > SCROLL_THRESHOLD;
        setScrolled(isScrolled);
        if (isScrolled) setActiveIndex(null);
        tickingRef.current = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousFocus = document.activeElement;
    dialogRef.current?.querySelector("button")?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
      if (e.key === "Tab") {
        const items = dialogRef.current?.querySelectorAll("a[href], button");
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const openSubmenu = (index) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveIndex(index);
  };

  const scheduleCloseSubmenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(
      () => setActiveIndex(null),
      MENU_CLOSE_DELAY,
    );
  };

  const activeItem = activeIndex !== null ? NAV_LINKS[activeIndex] : null;
  const isSubmenuOpen = Boolean(activeItem?.submenu?.length) && !scrolled;

  return (
    <>
      {/* Main header bar — slides fully off-screen (left → right) and fades out once scrolled;
         reverses (fades in while sliding back to x:0) as the user scrolls back up */}
      <motion.header
        inert={scrolled || menuOpen}
        initial={false}
        animate={{ x: scrolled ? "100%" : "0%", opacity: scrolled ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.65, ease: EASE }}
        style={{ height: HEADER_HEIGHT }}
        className="fixed inset-x-0 top-0 z-50 flex w-full items-center bg-[var(--dark)]/95 backdrop-blur-md"
      >
        {/* Brand-red wash — stays translucent so the dark header shows through underneath it;
           only turns into a richer, more solid gradient while a mega-menu is open */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[var(--dark)]/60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10"
        />

        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 md:px-10 lg:px-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Shree Labh Dhatu"
              width={200}
              height={200}
              className="h-16 w-auto lg:h-[88px]"
            />
          </Link>

          {/* Center navigation — desktop */}
          <nav
            onMouseLeave={scheduleCloseSubmenu}
            className="hidden lg:flex lg:items-center lg:gap-8 xl:gap-10"
          >
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() =>
                  link.submenu ? openSubmenu(i) : scheduleCloseSubmenu()
                }
                className="group relative py-2 text-[15px] font-medium tracking-wide text-white transition-colors duration-300"
              >
                {link.label}
                <span
                  className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left bg-[var(--brand-light)] transition-transform duration-300 ease-out"
                  style={{ transform: `scaleX(${activeIndex === i ? 1 : 0})` }}
                />
              </a>
            ))}
          </nav>

          {/* Menu toggle — mobile & tablet only (desktop uses the floating button once scrolled) */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="site-button site-button--on-dark site-icon-button header-mobile-toggle"
          >
            <Menu className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </motion.header>

      {/* Floating menu button — fades in once the header has slid away */}
      <motion.button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        initial={false}
        animate={{
          opacity: scrolled ? 1 : 0,
          scale: scrolled ? 1 : 0.7,
          x: scrolled ? 0 : 24,
        }}
        transition={{
          duration: reduceMotion ? 0 : 0.45,
          ease: EASE,
          delay: scrolled ? 0.15 : 0,
        }}
        aria-hidden={!scrolled || menuOpen}
        style={{
          pointerEvents: scrolled && !menuOpen ? "auto" : "none",
          visibility: scrolled && !menuOpen ? "visible" : "hidden",
        }}
        whileHover={{ scale: scrolled ? 1.06 : 0.7 }}
        whileTap={{ scale: scrolled ? 0.94 : 0.7 }}
        tabIndex={scrolled && !menuOpen ? 0 : -1}
        className="site-button site-button--light site-icon-button fixed right-5 top-5 z-50 shadow-lg sm:right-8 sm:top-6"
      >
        <Menu className="h-4 w-4 lg:h-5 lg:w-5" strokeWidth={2} />
      </motion.button>

      {/* Hover mega-menu overlay */}
      <AnimatePresence>
        {isSubmenuOpen && (
          <motion.div
            key="submenu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: EASE }}
            onMouseEnter={() => openSubmenu(activeIndex)}
            onMouseLeave={scheduleCloseSubmenu}
            style={{ top: HEADER_HEIGHT }}
            className="fixed inset-x-0 z-40 hidden border-t border-white/10 bg-[var(--dark)]/98 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:block"
          >
            <div className="mx-auto max-w-[1600px] px-6 py-10 md:px-10 lg:px-14">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                {activeItem?.label}
              </p>
              <div className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
                {activeItem?.submenu?.map((sub) => (
                  <a
                    key={sub.label}
                    href={sub.href}
                    className="group flex items-center justify-between gap-3 border-b border-white/10 pb-3 text-[15px] font-medium text-white/80 transition-colors duration-300 hover:text-[var(--brand-light)]"
                  >
                    {sub.label}
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/30 transition-colors duration-300 group-hover:text-[var(--brand-light)]" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-50 bg-[var(--dark)]"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="site-button site-button--on-dark site-icon-button absolute right-6 top-6 md:right-10 md:top-8"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-full flex-col overflow-y-auto px-6 py-24 sm:px-8 md:px-16 lg:px-24">
              <motion.nav
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
                  },
                }}
                className="flex flex-col gap-1"
              >
                {NAV_LINKS.map((link, i) => (
                  <div key={link.label}>
                    <motion.a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      variants={{
                        hidden: { opacity: 0, y: 40 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="group flex items-baseline gap-4 border-b border-white/10 py-3.5 md:py-4"
                    >
                      <span className="text-xs text-white/40 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[clamp(1.75rem,5vw,3.25rem)] font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-[var(--brand-light)]">
                        {link.label}
                      </span>
                    </motion.a>
                    {link.label === "Our Products" && (
                      <div className="grid grid-cols-2 gap-2 py-3">
                        {link.submenu.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex min-h-11 items-center border border-white/15 px-3 py-2 text-sm text-white/85 hover:border-[var(--brand)] hover:text-[var(--brand-light)]"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
                className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-white/60"
              >
                <a
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="site-button site-button--light"
                >
                  Contact us
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                {/* s */}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
