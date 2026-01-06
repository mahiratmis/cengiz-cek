"use client";

import { useEffect, useState } from "react";
import styles from "../DemoLanding.module.css";

export default function SpecialPopupClient() {
  const [popup, setPopup] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/special-popup", { cache: "no-store" });
        const data = await res.json();
        if (!data) return;

        // Aynı popup kapatıldıysa tekrar gösterme (ID bazlı)
        const key = `special-popup-dismissed-${data.id}`;
        const dismissed =
          typeof window !== "undefined" ? localStorage.getItem(key) : null;
        if (dismissed) return;

        setPopup(data);
        setOpen(true);
      } catch {
        // sessiz geç
      }
    };

    load();
  }, []);

  const close = () => {
    setOpen(false);
    if (popup?.id && typeof window !== "undefined") {
      localStorage.setItem(`special-popup-dismissed-${popup.id}`, "1");
    }
  };

  if (!popup || !open) return null;

  return (
    <div className={styles.modalOverlay} onClick={close}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640 }}
      >
        <div className={styles.modalHeader}>
          <h3 style={{ fontWeight: 800, fontSize: 18 }}>
            {popup.title || "Duyuru"}
          </h3>
          <button className={styles.closeBtn} onClick={close} aria-label="Kapat">
            &times;
          </button>
        </div>

        <div>
          <img
            src={popup.imageUrl}
            alt={popup.title || "Popup"}
            style={{
              width: "100%",
              maxHeight: 460,
              objectFit: "contain",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              display: "block",
            }}
          />

          {popup.description ? (
            <p style={{ marginTop: 12, color: "#374151", lineHeight: 1.5 }}>
              {popup.description}
            </p>
          ) : null}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <button className={styles.btnSecondary} type="button" onClick={close}>
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
