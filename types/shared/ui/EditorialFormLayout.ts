import type { ReactNode } from "react";

export type EditorialFormLayoutProps = {
  introKicker: string;
  title: string;
  description: string;
  endpoint: string;
  endpointSummary: string;
  children: ReactNode;
};
