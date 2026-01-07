"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
// ✅ senin form componentin hangisiyse onu import et
import ExamApplicationForm from "../components/ExamApplicationForm";

export default function ExamApplyClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sp = new URLSearchParams(window.location.search);
    const sube = sp.get("sube");

    if (!sube) return;

    try {
      localStorage.setItem("activeBranch", sube);
      window.dispatchEvent(new Event("branch-changed"));
    } catch (e) {
      console.warn("Branch ayarlanamadı", e);
    }
  }, []);

    return <ExamApplicationForm />
}


