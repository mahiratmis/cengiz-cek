import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SiteLayout from "../../SiteLayout";
import styles from "../../DemoLanding.module.css";
import Container from "../../components/Container";

export async function generateMetadata({ params }) {
  const duyuru = await prisma.announcement.findUnique({
    where: { slug: params.slug },
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
  const duyuru = await prisma.announcement.findUnique({
    where: { slug: params.slug },
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
            <h1 className={styles.sectionTitle} style={{ marginBottom: 8 }}>
              {duyuru.title}
            </h1>
          </div>

          <article
            style={{
              background: "#ffffff",
              borderRadius: 12,
              padding: 16,
              border: "1px solid #e5e7eb",
            }}
            dangerouslySetInnerHTML={{ __html: duyuru.content }}
          />
        </Container>
      </section>
    </SiteLayout>
  );
}
