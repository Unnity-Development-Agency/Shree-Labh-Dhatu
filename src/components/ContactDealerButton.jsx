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

  const sizeClasses = size === "lg" ? "min-w-56" : "min-w-48";

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
        className={`site-button ${sizeClasses}`}
      >
        Contact Dealer
        <ArrowRight
          className="h-4 w-4"
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
          className={`site-button site-button--outline ${sizeClasses}`}
        >
          Request a Quote
          <FileText className="h-4 w-4" aria-hidden="true" />
        </motion.a>
      )}
    </div>
  );
}
