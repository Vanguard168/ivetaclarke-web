"use client";
import { useEffect } from "react";

export default function MasterclassRedirect() {
  useEffect(() => {
    window.location.replace("/#vycvik");
  }, []);
  return null;
}
