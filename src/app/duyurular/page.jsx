import { prisma } from "@/lib/prisma";
import SiteLayout from "../SiteLayout";
import styles from "../DemoLanding.module.css";
import Container from "../components/Container";
import Link from "next/link";

export const dynamic = "force-dynamic"; // İstersen, cache'lemesin diye

export default async function DuyurularPage() {
  const now = new Date();

  const announcements = await prisma.announcement.findMany({
    where: {
      isPublished: true,
      OR: [
        { publishAt: null },
        { publishAt: { lte: now } },
      ],
    },
    orderBy: { publishAt: "desc" },
  });

  const stripHtml = (html) =>
    html ? html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
  
  const getSummary = (d, limit = 100) => {
    const text = d.summary && d.summary.trim().length > 0
      ? d.summary
      : stripHtml(d.content);
  
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  return (
    <SiteLayout>
      <section className={styles.section}>
        <Container>
          <h1 className={styles.sectionTitle}>Tüm Duyurular</h1>

          <div className={styles.grid}>
            {announcements.length === 0 ? (
              <p style={{ color: "#555" }}>Henüz duyuru bulunmuyor.</p>
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
    </SiteLayout>
  );
}
