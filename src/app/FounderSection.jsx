"use client";

import { useState } from "react";
import styles from "./DemoLanding.module.css";

// Aynı Container mantığı
const Container = ({ children }) => (
  <div className={styles.container}>{children}</div>
);

export default function FounderSection({ staff = [] }) {
  const fallback = [
    { name: "Ali Yılmaz", branch: "Matematik", photoUrl: "/staff/1.jpg" },
    { name: "Ayşe Demir", branch: "Fizik", photoUrl: "/staff/2.jpg" },
    { name: "Mehmet Kaya", branch: "Kimya", photoUrl: "/staff/3.jpg" },
  ];
  

  const list = staff.length ? staff : fallback;

  const [selected, setSelected] = useState(null);

  const closeModal = () => setSelected(null);

  return (
    <>
      <section id="kadromuz" className={styles.staffSection}>
        <Container>
          <h2 className={styles.sectionTitle}>Kadromuz</h2>
          <div className={styles.staffGrid}>
            {list.map((p, idx) => (
              <article
                key={p.id ?? idx}
                className={styles.staffCard}
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(p)}
              >
                <img
                  className={styles.staffAvatar}
                  src={p.photoUrl || p.photo || "/staff/1.jpg"}
                  alt={p.name}
                  width={240}
                  height={240}
                />
                <div className={styles.staffName}>{p.name}</div>
                <div className={styles.staffBranch}>{p.branch}</div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Detay Modalı */}
      {selected && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 520 }}
          >
            <div className={styles.modalHeader}>
              <h3 style={{ fontWeight: 700, fontSize: 18 }}>
                {selected.name}
              </h3>
              <button
                className={styles.closeBtn}
                onClick={closeModal}
                aria-label="Kapat"
              >
                &times;
              </button>
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              <img
                src={selected.photoUrl || selected.photo || "/staff/1.jpg"}
                alt={selected.name}
                width={140}
                height={140}
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
                  {selected.branch}
                </div>
                {selected.role && (
                  <div
                    style={{
                      fontSize: 13,
                      color: "#6b7280",
                      marginBottom: 8,
                    }}
                  >
                    {selected.role}
                  </div>
                )}
                {selected.bio ? (
                  <p
                    style={{
                      fontSize: 14,
                      color: "#4b5563",
                      lineHeight: 1.5,
                    }}
                    dangerouslySetInnerHTML={{ __html: selected.bio }}
                  />
                ) : (
                  <p
                    style={{
                      fontSize: 14,
                      color: "#4b5563",
                      lineHeight: 1.5,
                    }}
                  >
                    {selected.name} {selected.branch} alanında öğrencilerimize
                    destek vermektedir.
                  </p>
                )}
                <br />
                  {selected?.cvUrl && (                    
                    <a
                      href={selected.cvUrl}
                      className={styles.btnPrimary}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Özgeçmişi Görüntüle
                    </a>
                  )}                
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
