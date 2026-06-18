import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "xsmall";
  className?: string;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>, "href">;
