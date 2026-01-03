"use client";

import { useState } from "react";
import styles from "./DemoLanding.module.css";

const Container = ({ children }) => (
  <div className={styles.container}>{children}</div>
);

export default function BasarilarSection({ successStories = [] }) {
  const fallback = [
    {
      uni: "İTÜ",
      dept: "Bilgisayar Mühendisliği",
      name: "E.B.",
      year: 2025,
      photoUrl: "/students/1.jpg",
      detail:
        "E.B., sayısal puan türünde derece yaparak İTÜ Bilgisayar Mühendisliği bölümüne yerleşmiştir.",
    },
    {
      uni: "ODTÜ",
      dept: "Elektrik-Elektronik Mühendisliği",
      name: "M.K.",
      year: 2025,
      photoUrl: "/students/2.png",
      detail:
        "M.K., düzenli deneme takibi ve soru çözüm kamplarıyla hedefi olan ODTÜ Elektrik-Elektronik Mühendisliği’ni kazanmıştır.",
    },
    {
      uni: "Hacettepe Üniversitesi",
      dept: "Tıp Fakültesi",
      name: "S.A.",
      year: 2025,
      photoUrl: "/students/3.jpg",
      detail:
        "S.A., YKS sürecinde istikrarlı net artışıyla Hacettepe Tıp Fakültesi’ne yerleşmiştir.",
    },
  ];

  const winners = successStories.length ? successStories : fallback;
  const [selected, setSelected] = useState(null);

  const closeModal = () => setSelected(null);

  return (
    <>
      <section id="basarilar" className={`${styles.section} ${styles.success}`}>
        <Container>
          <h2 className={styles.sectionTitle}>Başarılarımız</h2>
          <div className={`${styles.grid} ${styles.gridTopGap}`}>
            {winners.map((s, i) => (
              <article
                key={s.id ?? i}
                className={styles.successCard}
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(s)}
              >
                <img
                  className={styles.sPhoto}
                  src={s.photoUrl || s.photo || "/students/1.jpg"}
                  alt={`${s.name} - ${s.uni}`}
                  width={1200}
                  height={900}
                />
                <div className={styles.sBody}>
                  <div className={styles.sMeta}>{s.year} Yerleşen</div>
                  <div className={styles.sUni}>
                    {s.uni} – {s.dept}
                  </div>
                  <div style={{ color: "#374151", marginTop: 4 }}>
                    Öğrenci: {s.name}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {selected && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 560 }}
          >
            <div className={styles.modalHeader}>
              <h3 style={{ fontWeight: 700, fontSize: 18 }}>
                {selected.year} – {selected.uni}
              </h3>
              <button
                className={styles.closeBtn}
                onClick={closeModal}
                aria-label="Kapat"
              >
                &times;
              </button>
            </div>

            <div style={{ marginTop: 8, display: "flex", gap: 16 }}>
              <img
                src={selected.photoUrl || selected.photo || "/students/1.jpg"}
                alt={`${selected.name} - ${selected.uni}`}
                width={180}
                height={180}
                style={{
                  borderRadius: 16,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              <div>
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: 4,
                    color: "#111827",
                  }}
                >
                  {selected.dept}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    marginBottom: 8,
                  }}
                >
                  Öğrenci: {selected.name} – {selected.year} yerleşen
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "#4b5563",
                    lineHeight: 1.5,
                  }}
                >
                  {selected.detail ||
                    `${selected.name}, disiplinli çalışma programıyla ${selected.uni} ${selected.dept} bölümüne yerleşmiştir.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
