import Link from "next/link";
import styles from "./Button.module.css";

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
}) {
  const variantClassName = VARIANT_CLASS_NAMES[variant] || VARIANT_CLASS_NAMES.primary;
  const sizeClassName = size ? SIZE_CLASS_NAMES[size] : "";
  const mergedClassName = [styles.button, styles.fullWidthMobile, variantClassName, sizeClassName, className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={mergedClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={mergedClassName} {...props}>
      {children}
    </button>
  );
}
