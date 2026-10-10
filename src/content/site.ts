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
  /** Where the writing was first published; the posts now live on this site. */
  mediumUsername: "easyplantlife",
  mediumUrl: "https://medium.com/@easyplantlife",
  contactEmail: "hello@easyplantlife.com",
} as const;
