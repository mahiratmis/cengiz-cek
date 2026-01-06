"use client";
import { useState } from "react";

export default function CloudUpload({ kind = "image", onUploaded }) {
  const [loading, setLoading] = useState(false);

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", "staff");
    fd.append("kind", kind); // image | cv

    const r = await fetch("/api/upload", { method: "POST", body: fd });
    setLoading(false);

    if (!r.ok) {
      alert("Yükleme başarısız");
      return;
    }

    const data = await r.json(); // {url, publicId, ...}
    onUploaded?.(data);
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input
        type="file"
        accept={kind === "cv" ? "application/pdf" : "image/*"}
        onChange={onPick}
      />
      {loading ? <div style={{ fontSize: 12, opacity: 0.7 }}>Yükleniyor...</div> : null}
    </div>
  );
}
