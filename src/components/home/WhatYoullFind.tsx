import { type HTMLAttributes } from "react";
import Image from "next/image";

export interface WhatYoullFindProps extends HTMLAttributes<HTMLElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * WhatYoullFind Component
 *
 * A section that explains what visitors will find on the site,
 * building credibility and setting expectations.
 */
export function WhatYoullFind({
  className = "",
  ...props
}: WhatYoullFindProps) {
  const items = [
    {
      title: "Honest Writing",
      description:
        "No clickbait, no hype. Just thoughtful reflections on making plant-based choices work in real life.",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
    },
    {
      title: "Practical Ideas",
      description:
        "Simple systems and default meals that fit busy schedules—not elaborate recipes requiring special ingredients.",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: "No Pressure",
      description:
        "Take what helps, leave what doesn't. There's no membership, no upsells, no judgment for imperfect choices.",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      aria-label="What you'll find"
      data-testid="what-youll-find"
      className={`bg-white py-16 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8 ${className}`.trim()}
      {...props}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-neutral-800 mb-4">
            What You&apos;ll Find Here
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
            A quiet corner of the internet where plant-based living stays
            simple.
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-primary-50/50 p-6 md:p-7 transition-all duration-300 hover:border-primary-300 hover:shadow-lg text-center md:text-left"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-200">
                {item.icon}
              </div>
              <h3 className="font-heading text-xl text-neutral-800 mb-2 group-hover:text-primary-800 transition-colors">
                {item.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative element */}
        <div className="mt-16 flex justify-center items-center gap-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-neutral-200" />
          <Image
            src="/images/mark-logo.png"
            alt=""
            width={20}
            height={20}
            className="opacity-40"
            aria-hidden="true"
          />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-neutral-200" />
        </div>
      </div>
    </section>
  );
}
