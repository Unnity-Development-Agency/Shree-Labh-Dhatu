import React from "react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

const quickLinks = [
  "Home",
  "About Us",
  "Products",
  "Industries We Serve",
  "Contact",
];
const productLinks = [
  "Copper Plates",
  "Brass Plates",
  "Copper Wires",
  "Allied Metal Products",
];

const trustBadges = [
  "ETP GRADE COPPER",
  "90% • 98% • 99% PURITY TESTED",
  "GST REGISTERED",
  "SINCE 1994 — 30+ YEARS OF TRUST",
  "PAN INDIA DELIVERY",
];

export default function Footer() {
  return (
    <footer className="metal-footer bg-[var(--dark)] text-gray-300">
      {/* Top trust bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-xs font-semibold tracking-wide text-gray-200">
            {trustBadges.map((badge) => (
              <li key={badge} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
          {/* Company info */}
          <div>
            <h3 className="text-xl font-bold text-white">
              Shree Labh Dhatu Traders Pvt. Ltd.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Trusted Traders. Trusted Quality.
              <br />
              Since 1994 — 30+ years of trust in the non-ferrous metal trading
              industry.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-500/60 text-gray-300 transition-colors hover:border-red-500 hover:text-red-500"
              >
                <FaLinkedinIn size={16} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-500/60 text-gray-300 transition-colors hover:border-red-500 hover:text-red-500"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://wa.me/919810296868"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-500/60 text-xs font-semibold text-gray-300 transition-colors hover:border-red-500 hover:text-red-500"
              >
                WA
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">
              Quick Links
            </h4>
            <span className="mt-2 block h-0.5 w-8 bg-red-500" />
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">
              Products
            </h4>
            <span className="mt-2 block h-0.5 w-8 bg-red-500" />
            <ul className="mt-5 space-y-3 text-sm">
              {productLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">
              Contact Us
            </h4>
            <span className="mt-2 block h-0.5 w-8 bg-red-500" />
            <ul className="mt-5 space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <FaMapMarkerAlt
                  size={16}
                  className="mt-0.5 shrink-0 text-gray-500"
                />
                <span>
                  Branch 1
                  <br />
                  3777 main road pahari dhiraj , sadar bazar Delhi 110006
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt size={16} className="shrink-0 text-gray-500" />
                <a href="tel:+91 9810296868">+91 9810296868</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope size={16} className="shrink-0 text-gray-500" />
                <a href="mailto:shreelabh3777@gmail.com">
                  shreelabh3777@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaClock size={16} className="shrink-0 text-gray-500" />
                <span>Mon – Sat: 9:30 AM – 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-gray-500 sm:flex-row">
          <p>© 2026 Shree Labh Dhatu Traders Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
