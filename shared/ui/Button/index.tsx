import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";
import type { ButtonProps } from "@/types/shared/ui/Button";

const VARIANT_CLASS_NAMES = {
  primary: styles.primary,
  secondary: styles.secondary,
  danger: styles.danger,
};

const SIZE_CLASS_NAMES = {
  small: styles.small,
  xsmall: styles.xsmall,
};

export default function Button({
  href,
  variant = "primary",
  size,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variantClassName = VARIANT_CLASS_NAMES[variant] || VARIANT_CLASS_NAMES.primary;
  const sizeClassName = size ? SIZE_CLASS_NAMES[size] : "";
  const mergedClassName = [styles.button, styles.fullWidthMobile, variantClassName, sizeClassName, className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={mergedClassName} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={mergedClassName} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
