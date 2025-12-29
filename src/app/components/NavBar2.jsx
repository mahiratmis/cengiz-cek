"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../DemoLanding.module.css";
import Container from "./Container";

const LINKS = [
  { id: "duyurular", label: "Duyurular" },
  { id: "basarilar", label: "Başarılarımız" },
  { id: "kadromuz", label: "Kadromuz" },
  { id: "kareler", label: "Kareler" },
  { id: "yorumlar", label: "Yorumlar" },
  { id: "iletisim", label: "İletişim" },
  { id: "sosyal", label: "Sosyal" },
];

export default function NavBar2() {
  const [active, setActive] = useState("");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSlug = searchParams.get("sube") || "mahfesigmaz";

  // Başlangıçta hash'e göre aktif link
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash?.replace("#", "");
      if (hash && LINKS.some((l) => l.id === hash)) {
        setActive(hash);
      }
    }
  }, []);

  // Şubeleri çek
  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await fetch("/api/branches");
        const data = await res.json();
        setBranches(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Şubeler alınamadı:", e);
      } finally {
        setLoading(false);
      }
    }
    loadBranches();
  }, []);

  const handleBranchChange = (e) => {
    const slug = e.target.value;
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (!slug || slug === "mahfesigmaz") {
      params.delete("sube");
    } else {
      params.set("sube", slug);
    }

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  };

  return (
    <nav className={styles.navbar2} aria-label="Site Navigasyonu">
      <Container>
        <div className={styles.nav2Inner}>
          <div className={styles.nav2Links}>
            {LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`/#${id}`}
                className={`${styles.nav2Link} ${
                  active === id ? styles.active : ""
                }`}
                onClick={() => setActive(id)}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Sağ tarafa zarif şube seçici */}
          <div className={styles.nav2Right}>
            <span className={styles.branchSelectLabel}>Şube</span>
            <select
              className={styles.branchSelect}
              value={currentSlug}
              onChange={handleBranchChange}
              disabled={loading || branches.length === 0}
            >
              {branches.length === 0 ? (
                <option value={currentSlug}>Şube yok</option>
              ) : (
                branches.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </Container>
    </nav>
  );
}
