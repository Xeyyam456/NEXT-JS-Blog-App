import type { Dispatch, SetStateAction } from "react";

export type UseDisclosureReturn = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
