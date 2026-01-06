"use client";

import Link from "next/link";
import styles from "../DemoLanding.module.css";
import Container from "./Container";

export default function LatestNews({ announcements = [] }) {
  const items = (announcements || []).filter(
    (a) => a?.title && a?.slug
  );

  return (
    <section className={styles.latestNewsBar} aria-label="Son duyurular">
      <Container>
        <div className={styles.latestInner}>
          <span className={styles.latestBadge}>Son Duyurular</span>

          <div className={styles.latestText}>
            {items.length > 0 ? (
              items.map((a, idx) => (
                <span key={a.slug}>
                  <Link
                    href={`/duyuru/${encodeURIComponent(a.slug)}`}
                    className={styles.latestLink}
                  >
                    {a.title}
                  </Link>

                  {idx !== items.length - 1 && (
                    <span className={styles.latestSep}> • </span>
                  )}
                </span>
              ))
            ) : (
              <span>🎓 Duyurular yakında burada yayınlanacak.</span>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
