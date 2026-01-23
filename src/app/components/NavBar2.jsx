"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../DemoLanding.module.css";
import Container from "./Container";

const LINKS = [
  { id: "duyurular", label: "Duyurular" },
  { id: "basarilar", label: "Başarılarımız" },
  { id: "kurucular", label: "Kurucularımız" },
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
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ URL değiştikçe otomatik güncellenir
  const currentSlug = searchParams.get("sube") || "guzelyali_yks";

  useEffect(() => {
    const setFromHash = () => {
      const hash = window.location.hash?.replace("#", "");
      if (hash && LINKS.some((l) => l.id === hash)) setActive(hash);
    };

    setFromHash();
    window.addEventListener("hashchange", setFromHash);
    return () => window.removeEventListener("hashchange", setFromHash);
  }, []);

  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await fetch("/api/branches", { cache: "no-store" });
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

    const params = new URLSearchParams(searchParams.toString());
    if (!slug || slug === "guzelyali_yks") params.delete("sube");
    else params.set("sube", slug);

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");

    // Eğer sayfada Server Component verisi şubeye göre değişiyorsa bu şart:
    router.refresh();

    setMenuOpen(false);
  };

  const handleNavClick = (id) => {
    setActive(id);
    setMenuOpen(false);
  };

  return (
    <nav className={styles.navbar2} aria-label="Site Navigasyonu">
      <Container>
        <div className={styles.nav2Bar}>
          <div className={styles.nav2LeftRow}>
            <div className={styles.nav2LinksDesktop}>
              {LINKS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`/#${id}`}
                  className={`${styles.nav2Pill} ${active === id ? styles.nav2PillActive : ""}`}
                  onClick={() => handleNavClick(id)}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.nav2RightRow}>
            <div className={styles.nav2RightDesktop}>
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

            <button
              type="button"
              className={styles.nav2Burger}
              aria-label="Menüyü Aç/Kapat"
              aria-expanded={menuOpen ? "true" : "false"}
              onClick={() => setMenuOpen((s) => !s)}
            >
              <span className={styles.nav2BurgerBar} />
              <span className={styles.nav2BurgerBar} />
              <span className={styles.nav2BurgerBar} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={styles.nav2MobilePanel}>
            <div className={styles.nav2MobileLinks}>
              {LINKS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`/#${id}`}
                  className={styles.nav2MobileLink}
                  onClick={() => handleNavClick(id)}
                >
                  {label}
                </a>
              ))}
            </div>

            <div className={styles.nav2MobileBranch}>
              <div className={styles.branchSelectLabel}>Şube</div>
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
        )}
      </Container>
    </nav>
  );
}
