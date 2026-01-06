import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SiteLayout from "../../SiteLayout";
import styles from "../../DemoLanding.module.css";
import Container from "../../components/Container";

export async function generateMetadata({ params }) {
  const prms = await params
  const duyuru = await prisma.announcement.findUnique({
    where: { slug:  prms.slug},
    select: { title: true },
  });

  if (!duyuru) {
    return {
      title: "Duyuru Bulunamadı | Cengiz Eğitim Kurumu",
    };
  }

  return {
    title: `${duyuru.title} | Cengiz Eğitim Kurumu`,
  };
}

export default async function DuyuruDetayPage({ params }) {
  const p = await params;
  const duyuru = await prisma.announcement.findUnique({
    where: { slug: p.slug },
  });

  if (!duyuru || !duyuru.isPublished) {
    notFound();
  }

  return (
    <SiteLayout>
      <section className={styles.section}>
        <Container>
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: 13,
                color: "#6b7280",
                marginBottom: 4,
              }}
            >
              {duyuru.createdAt
                ? new Date(duyuru.createdAt).toLocaleDateString("tr-TR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : null}
            </div>
            {/* {duyuru.coverImageUrl ? (
              <div>
              <img
                src={duyuru.coverImageUrl}
                alt={duyuru.title}
                style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 12, marginBottom: 14, display: "block" }}
              />
              </div>
            ) : null} */}
            <h1 className={styles.sectionTitle} style={{ marginBottom: 8 }}>
              {duyuru.title}
            </h1>
          </div>

          <article
            className={styles.announcementBody}
            dangerouslySetInnerHTML={{ __html: duyuru.content }}
          />
        </Container>
      </section>
    </SiteLayout>
  );
}
