"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import {
  Phone,
  Mail,
  User,
  Building2,
  Package,
  PenLine,
  Send,
  Lock,
  UserCheck,
  ShieldCheck,
  Handshake,
  ChevronDown,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* Image Live Link Who Stay in Contact Left SIde. */
const contactImage = "./stock.png";

const features = [
  {
    icon: UserCheck,
    title: "Quick Response",
    description: "Our team will get back to you shortly.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Support",
    description: "Expert guidance for the right solution.",
  },
  {
    icon: Handshake,
    title: "Long Term Partnership",
    description: "Building trust through quality & reliability.",
  },
];

/* Edit this list to match your actual product catalog. */
const productOptions = [
  "Copper Sheet",
  "Copper Coil",
  "Copper Strip",
  "Copper Wire",
  "Brass Plates",
  "Aluminium Sheet",
  "Stainless Steel Sheet",
  "Other",
];

const initialFormState = {
  fullName: "",
  companyName: "",
  phone: "",
  email: "",
  product: "",
  message: "",
};

export default function ContactPage() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState(initialFormState);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      /* -----------------------------------------------------------------
         TODO: Replace Script With  Client Email/ GSHEET.
         ----------------------------------------------------------------- */

      setStatus("success");
      setForm(initialFormState);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <>
      <Header />
      <section className="w-full bg-[var(--page-bg)] px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: false, amount: 0.15 }}
          variants={reduceMotion ? undefined : containerVariants}
          className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-sm shadow-sm shadow-black/5 lg:grid-cols-2"
        >
          {/* ================= LEFT — info panel ================= */}
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="relative flex flex-col justify-between bg-[var(--surface)] p-6 sm:p-10 lg:p-12"
          >
            <div>
              {/* eyebrow */}
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E53935]/40 text-[var(--muted)]">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Let&rsquo;s Connect
                </span>
                <span className="hidden h-px flex-1 bg-[#E53935]/30 sm:block" />
              </div>

              {/* heading */}
              <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
                Have a Requirement?
                <br />
                We&rsquo;re Here to{" "}
                <span className="text-[var(--muted)]">Help.</span>
              </h1>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-600 sm:text-base">
                Share your requirement details and our team will get back to you
                with the best solution tailored to your needs.
              </p>

              {/* features */}
              <ul className="mt-8 flex flex-col gap-5">
                {features.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--muted)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-[var(--muted)] sm:text-base">
                        {title}
                      </span>
                      <span className="block text-xs leading-relaxed text-zinc-600 sm:text-sm">
                        {description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* decorative product image */}
            <div className="mt-10 flex justify-start lg:mt-8 rounded-md">
              <img
                src={contactImage}
                alt="Stacked copper plates"
                className="h-40 w-auto max-w-full object-contain sm:h-52 rounded-md"
              />
            </div>
          </motion.div>

          {/* ================= RIGHT — enquiry form ================= */}
          <motion.div
            variants={reduceMotion ? undefined : fadeUpVariants}
            className="bg-white p-6 sm:p-10 lg:p-12"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E53935]/40 text-[var(--muted)]">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--muted)] sm:text-base">
                  Send Us an Enquiry
                </h2>
                <p className="text-xs text-zinc-500 sm:text-sm">
                  Please fill in the details below and we will get back to you.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  required
                  icon={User}
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                <Field
                  label="Company Name"
                  required
                  icon={Building2}
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field
                  label="Phone Number"
                  required
                  icon={Phone}
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                <Field
                  label="Email Address"
                  required
                  icon={Mail}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                />
              </div>

              {/* product select */}
              <div>
                <label
                  htmlFor="product"
                  className="mb-2 block text-sm font-semibold text-zinc-900"
                >
                  Product Interested In{" "}
                  <span className="text-[var(--muted)]">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                    <Package className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <select
                    id="product"
                    name="product"
                    required
                    value={form.product}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-sm border border-zinc-200 bg-white py-3.5 pl-11 pr-10 text-sm text-zinc-900 outline-none transition-colors duration-200 focus:border-[#E53935]"
                  >
                    <option value="" disabled>
                      Select a product
                    </option>
                    {productOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-zinc-900"
                >
                  Message / Requirement Details{" "}
                  <span className="text-[var(--muted)]">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-4 text-[var(--muted)]">
                    <PenLine className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Please mention size, grade, quantity or any other requirement"
                    className="w-full resize-y rounded-sm border border-zinc-200 bg-white py-3.5 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-colors duration-200 placeholder:text-zinc-400 focus:border-[#E53935]"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                className="site-button mt-1 w-full justify-center"
              >
                {status === "submitting" ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Send Enquiry
                  </>
                )}
              </motion.button>

              {status === "success" && (
                <p className="text-center text-sm font-medium text-emerald-600">
                  Thank you — your enquiry has been sent.
                </p>
              )}
              {status === "error" && (
                <p className="text-center text-sm font-medium text-red-600">
                  Something went wrong. Please try again.
                </p>
              )}

              <p className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                Your information is safe with us. We will never share your
                details.
              </p>
            </form>
          </motion.div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}

/* Small reusable input field, keeps the two-column groups above from
   duplicating markup. */
function Field({
  label,
  required,
  icon: Icon,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-zinc-900"
      >
        {label} {required && <span className="text-[var(--muted)]">*</span>}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-sm border border-zinc-200 bg-white py-3.5 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-colors duration-200 placeholder:text-zinc-400 focus:border-[#E53935]"
        />
      </div>
    </div>
  );
}
