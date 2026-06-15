"use client";

import { useState } from "react";

export default function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function toggle() {
    setIsOpen((currentValue) => !currentValue);
  }

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}