"use client";

import { useMemo, useState } from "react";
import styles from "./DemoLanding.module.css";

const Container = ({ children }) => (
  <div className={styles.container}>{children}</div>
);

/**
 * props:
 * - staff: array
 * - mode: "staff" | "founders"   (default: "staff")
 */
export default function StaffSection({
  staff = [],
  mode = "staff",
}) {
  const fallback = [
    {
      id: 1,
      branchId: "adana",
      isFounder: true,
      name: "Kurucu Örnek",
      branch: "Kurum Kurucusu",
      photoUrl: "/staff/1.jpg",
      cvUrl: "/cv/kurucu-ornek.pdf",
    },
    {
      id: 2,
      branchId: "adana",
      isFounder: false,
      name: "Ali Yılmaz",
      branch: "Matematik",
      photoUrl: "/staff/1.jpg",
      cvUrl: "/cv/ali-yilmaz.pdf",
    },
    {
      id: 3,
      branchId: "adana",
      isFounder: false,
      name: "Ayşe Demir",
      branch: "Fizik",
      photoUrl: "/staff/2.jpg",
      cvUrl: "/cv/ayse-demir.pdf",
    },
  ];

  const baseList = staff.length ? staff : fallback;

  function pdfUrlToJpegUrl(url) {
    return typeof url === "string" && url.toLowerCase().endsWith(".pdf")
      ? url.replace(/\.pdf$/i, ".jpeg")
      : url;
  }
  

  const list = useMemo(() => {
    return baseList
      .filter((p) => {

        // kurucu/kadro filtresi
        if (mode === "founders") return !!p.isFounder;
        return !p.isFounder;
      });
  }, [baseList, mode]);

  const [selected, setSelected] = useState(null);
  const closeModal = () => setSelected(null);

  const sectionId = mode === "founders" ? "kurucular" : "kadromuz";
  const title = mode === "founders" ? "Kurucularımız" : "Kadromuz";

  if (!list.length) return null;

  return (
    <>
      <section id={sectionId} className={styles.staffSection}>
        <Container>
          <h2 className={styles.sectionTitle}>{title}</h2>

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
                <div style={{ fontWeight: 600, marginBottom: 4, color: "#111827" }}>
                  {selected.branch}
                </div>

                {selected.role && (
                  <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
                    {selected.role}
                  </div>
                )}

                {selected.bio ? (
                  <p
                    style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.5 }}
                    dangerouslySetInnerHTML={{ __html: selected.bio }}
                  />
                ) : (
                  <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.5 }}>
                    {selected.name} {selected.branch} alanında öğrencilerimize destek vermektedir.
                  </p>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                {selected?.cvUrl && (
                  <>
                    <a
                      href={selected.cvUrl}
                      className={styles.btnPrimary}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Özgeçmişi Görüntüle
                    </a>

                  </>
                )}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
