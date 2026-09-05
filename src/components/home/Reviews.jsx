import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Mehta",
    role: "Procurement Manager, Mehta Engineering",
    avatar: "https://i.pravatar.cc/96?img=12",
    review:
      "Consistent copper quality, accurate specifications and dependable delivery on every order.",
  },
  {
    name: "Daniel Carter",
    role: "Operations Director, Carter Fabrications",
    avatar: "https://i.pravatar.cc/96?img=13",
    review:
      "A reliable supply partner that understands the precision our production schedule demands.",
  },
  {
    name: "Arjun Sharma",
    role: "Plant Head, Apex Components",
    avatar: "https://i.pravatar.cc/96?img=15",
    review:
      "The material finish and dimensional consistency have been excellent across repeat orders.",
  },
  {
    name: "Michael Anderson",
    role: "Supply Chain Lead, Northfield Metals",
    avatar: "https://i.pravatar.cc/96?img=14",
    review:
      "Clear communication, reliable lead times and quality we can confidently specify to clients.",
  },
  {
    name: "Priya Kapoor",
    role: "Quality Manager, Vertex Industries",
    avatar: "https://i.pravatar.cc/96?img=32",
    review:
      "Every batch has met our inspection standards. Their service team is prompt and knowledgeable.",
  },
  {
    name: "Vikram Singh",
    role: "Director, Sterling Electricals",
    avatar: "https://i.pravatar.cc/96?img=11",
    review:
      "Their team helped us choose the right grade quickly, with no compromise on delivery timelines.",
  },
  {
    name: "Emily Roberts",
    role: "Buyer, Roberts Manufacturing",
    avatar: "https://i.pravatar.cc/96?img=47",
    review:
      "A refreshingly professional experience from quotation through to dispatch and after-sales support.",
  },
  {
    name: "Karan Malhotra",
    role: "Project Manager, Malhotra Works",
    avatar: "https://i.pravatar.cc/96?img=68",
    review:
      "They consistently deliver industrial-grade material that performs exactly as promised.",
  },
];

function TestimonialItem({ testimonial }) {
  return (
    <article className="rv-item grid w-[20rem] shrink-0 grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-3.5 px-5 sm:w-[25rem] sm:grid-cols-[3rem_minmax(0,1fr)] sm:px-7 lg:w-[29rem]">
      <img
        src={testimonial.avatar}
        alt={`${testimonial.name} profile photo`}
        className="h-11 w-11 shrink-0 rounded-full border-2 border-[var(--brand)]/20 object-cover p-0.5 sm:h-12 sm:w-12"
      />
      <div className="relative min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 pr-16">
          <h3 className="text-sm font-semibold text-[var(--ink)]">
            {testimonial.name}
          </h3>
          <span className="hidden text-[10px] text-zinc-400 sm:inline">•</span>
          <p className="basis-full truncate text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
            {testimonial.role}
          </p>
        </div>
        <div
          className="absolute right-0 top-0 flex items-center gap-0.5 text-[var(--brand-ink)]"
          aria-label="5 out of 5 stars"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="h-3 w-3 fill-current"
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          “{testimonial.review}”
        </p>
      </div>
    </article>
  );
}

export default function Reviews() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--page-bg)] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      aria-labelledby="reviews-heading"
    >
      <style>{`
        @keyframes reviews-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .rv-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: reviews-marquee 46s linear infinite;
        }
        .rv-group {
          display: flex;
          flex: none;
        }
        .rv-item + .rv-item {
          border-left: 1px solid rgba(39, 39, 42, 0.12);
        }
        @media (hover: hover) and (pointer: fine) {
          .rv-marquee:hover .rv-track { animation-play-state: paused; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rv-marquee { overflow: visible; }
          .rv-track { width: auto; flex-wrap: wrap; animation: none; transform: none; }
          .rv-group { flex-wrap: wrap; width: 100%; }
          .rv-group-copy { display: none; }
          .rv-item { width: 100%; padding: 1.25rem 0; }
          .rv-item + .rv-item { border-left: 0; border-top: 1px solid rgba(39, 39, 42, 0.12); }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div
          className="absolute inset-x-0 top-0 h-64 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(rgba(245,61,20,0.2) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
        <div className="absolute -right-32 top-8 h-72 w-72 rounded-full bg-[var(--brand)]/[0.07] blur-3xl" />
        <div className="absolute left-[12%] top-20 h-px w-56 -rotate-12 bg-gradient-to-r from-transparent via-[var(--brand)]/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center">
            <span className="h-0.5 w-12 rounded-full bg-[var(--brand)] sm:w-20" />
            <p className="mx-4 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-ink)]">
              What Our Customers Say
            </p>
            <span className="h-0.5 w-12 rounded-full bg-[var(--brand)] sm:w-20" />
          </div>
          <h2
            id="reviews-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl"
          >
            Client <span className="text-[var(--ink)]">Voices</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Real Feedback From Bussinesses That Trust Us For Quality Services
          </p>
        </header>
      </div>

      <div className="rv-marquee mt-11 overflow-hidden sm:mt-14">
        <div className="rv-track py-4">
          <div className="rv-group" aria-label="Customer testimonials">
            {testimonials.map((testimonial) => (
              <TestimonialItem
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </div>
          <div className="rv-group rv-group-copy" aria-hidden="true">
            {testimonials.map((testimonial) => (
              <TestimonialItem
                key={`duplicate-${testimonial.name}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
