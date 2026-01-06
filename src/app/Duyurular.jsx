import Link from "next/link";
import styles from "./DemoLanding.module.css";
import Container from "./components/Container";

export default function Duyurular({ announcements = [] }) {

  const stripHtml = (html) =>
    html ? html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
  
  const getSummary = (d, limit = 100) => {
    const text = d.summary && d.summary.trim().length > 0
      ? d.summary
      : stripHtml(d.content);
  
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  return (
    <section id="duyurular" className={styles.section}>
      <Container>
        {/* Başlık + Tümünü gör linki */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            alignItems: "baseline",
            marginBottom: "16px",
          }}
        >
          <h2 className={styles.sectionTitle}>Duyurular</h2>
          <Link
            href="/duyurular"
            style={{ fontSize: 14, color: "#d40000", textDecoration: "none" }}
          >
            Tüm duyuruları gör →
          </Link>
        </div>

        <div className={styles.grid}>
          {announcements.length === 0 ? (
            <p style={{ color: "#555" }}>
              Henüz yayımlanmış duyuru bulunmuyor.
            </p>
          ) : (
            announcements.map((d) => (
              <Link
                key={d.id}
                href={`/duyuru/${d.slug}`}
                className={styles.card}
              >
                <article>
                  <div className={styles.cardAccent}></div>
                  <div className={styles.cardMeta}>
                    {d.createdAt
                      ? new Date(d.createdAt).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </div>
                  <div className={styles.cardTitle}>{d.title}</div>
                  <p style={{ color: "#374151" }}>
                    {getSummary(d, 100)}
                  </p>
                </article>
              </Link>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
