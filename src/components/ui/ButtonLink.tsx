import { forwardRef } from "react";
import { buttonClassName, type ButtonSize, type ButtonVariant } from "./Button";
import { Link, type LinkProps } from "./Link";

export interface ButtonLinkProps extends Omit<LinkProps, "variant"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * ButtonLink
 *
 * A link that looks exactly like Button. Use it for navigation and external
 * actions ("Buy on Amazon"); use Button for actions that stay on the page.
 */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    { variant = "primary", size = "md", className = "", ...props },
    ref
  ) {
    return (
      <Link
        ref={ref}
        variant="plain"
        className={buttonClassName({ variant, size, className })}
        {...props}
      />
    );
  }
);
