import SiteLayout from "../SiteLayout";
import Container from "../components/Container";
import ExamApplyClient from "./ExamApplyClient";

export const metadata = {
  title: "Sınav Başvurusu | Cengiz Eğitim Kurumu",
};

export default function SinavBasvurusuPage() {
  return (
    <SiteLayout>
      <section style={{ padding: "5px 0" }}>
        <Container>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
            Sınav Başvurusu
          </h1>
          <p style={{ color: "#6b7280", marginBottom: 18 }}>
            Formu doldurun, ekibimiz sizinle iletişime geçsin.
          </p>
          <ExamApplyClient />
        </Container>
      </section>
    </SiteLayout>
  );
}
