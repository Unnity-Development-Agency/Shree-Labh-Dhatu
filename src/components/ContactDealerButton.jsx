"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";

/**
 * Drop-in CTA used everywhere a visitor should be able to contact the
 * dealer about a specific product. Update `CONTACT_DEALER_HREF` /
 * `REQUEST_QUOTE_HREF` once the site's real contact-dealer route exists —
 * every usage across the Copper page (and, later, Brass/Aluminium/
 * Stainless Steel) updates automatically since they all import this one
 * component.
 */
const CONTACT_DEALER_HREF = "/contact";
const REQUEST_QUOTE_HREF = "/contact";

export default function ContactDealerButton({
  productName,
  showQuoteButton = true,
  size = "md",
  className = "",
}) {
  const reduceMotion = useReducedMotion();

  const sizeClasses =
    size === "lg" ? "px-7 py-3.5 text-sm" : "px-5 py-2.5 text-xs";

  const dealerHref = productName
    ? `${CONTACT_DEALER_HREF}?product=${encodeURIComponent(productName)}`
    : CONTACT_DEALER_HREF;
  const quoteHref = productName
    ? `${REQUEST_QUOTE_HREF}?product=${encodeURIComponent(productName)}&intent=quote`
    : REQUEST_QUOTE_HREF;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <motion.a
        href={dealerHref}
        aria-label={
          productName ? `Contact dealer about ${productName}` : "Contact dealer"
        }
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className={`group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#E53935]/40 bg-zinc-900 font-bold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E53935] ${sizeClasses}`}
      >
        Contact Dealer
        <ArrowRight
          className="h-3.5 w-3.5 text-[#E53935] transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </motion.a>

      {showQuoteButton && (
        <motion.a
          href={quoteHref}
          aria-label={
            productName
              ? `Request a quote for ${productName}`
              : "Request a quote"
          }
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          className={`group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-zinc-300 bg-white font-bold uppercase tracking-wide text-zinc-900 transition-colors duration-300 hover:border-[#E53935]/40 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E53935] ${sizeClasses}`}
        >
          Request a Quote
          <FileText className="h-3.5 w-3.5 text-[#E53935]" aria-hidden="true" />
        </motion.a>
      )}
    </div>
  );
}
