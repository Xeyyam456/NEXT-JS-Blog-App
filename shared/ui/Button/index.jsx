import Link from "next/link";

const VARIANT_CLASS_NAMES = {
  primary: "primary-button",
  secondary: "secondary-button",
  danger: "danger-button",
};

const SIZE_CLASS_NAMES = {
  small: "small-button",
  xsmall: "xsmall-button",
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
  const mergedClassName = [variantClassName, sizeClassName, className]
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