export interface NavItem {
  label: string;
  href: string;
}

/** Text links shown in the header. */
export const mainNavigation: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/** The header's single call to action, kept apart from the text links. */
export const newsletterNavItem: NavItem = {
  label: "Newsletter",
  href: "/newsletter",
};

/** Links shown in the footer. */
export const footerNavigation: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Blog", href: "/blog" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Contact", href: "/contact" },
];
