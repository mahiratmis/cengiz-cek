"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
// ✅ senin form componentin hangisiyse onu import et
import ExamApplicationForm from "../components/ExamApplicationForm";

export default function ExamApplyClient() {
  const sp = useSearchParams();
  const sube = sp.get("sube");

  // QR ile gelen sube parametresini localStorage'a yaz (senin sistem böyle çalışıyor)
  useEffect(() => {
    if (!sube) return;
    try {
      localStorage.setItem("activeBranch", sube);
      window.dispatchEvent(new Event("branch-changed"));
    } catch {}
  }, [sube]);

    return <ExamApplicationForm />
}
