import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Sadece anasayfada hash'i okuyup aktif linki işaretle
  useEffect(() => {
    if (typeof window !== "undefined" && isHome) {
      const hash = window.location.hash?.replace("#", "");
      if (hash && LINKS.some((l) => l.id === hash)) setActive(hash);
    }
  }, [isHome]);

  return (
    <nav className={styles.navbar2} aria-label="Site Navigasyonu">
      <Container>
        <div className={styles.nav2Inner}>
          <div className={styles.nav2Links}>
            {LINKS.map(({ id, label }) => {
              // Anasayfadaysak sadece "#id"
              // Diğer sayfalarda "/#id" (önce ana sayfa, sonra scroll)
              const href = isHome ? `#${id}` : `/#${id}`;

              return (
                <Link
                  key={id}
                  href={href}
                  className={`${styles.nav2Link} ${
                    active === id && isHome ? styles.active : ""
                  }`}
                  onClick={() => {
                    if (isHome) {
                      setActive(id);
                    }
                    // başka sayfadaysak, Link zaten /#id'ye götürecek,
                    // active durumunu ana sayfa açılınca useEffect yakalayacak
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </nav>
  );
}
