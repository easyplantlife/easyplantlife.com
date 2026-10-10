/**
 * Site-wide facts used across components.
 *
 * Anything here is public: it appears in rendered HTML.
 */
export const siteConfig = {
  name: "Easy Plant Life",
  tagline:
    "A quiet place on the internet for plant-based living that fits real life.",
  url: "https://easyplantlife.com",
  /** Medium is the canonical home of the writing; the site only lists it. */
  mediumUsername: "easyplantlife",
  mediumUrl: "https://medium.com/@easyplantlife",
  contactEmail: "hello@easyplantlife.com",
} as const;
