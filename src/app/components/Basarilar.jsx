import styles from "../DemoLanding.module.css";
import Container from "./Container";

export default function Basarilar() {
  const winners = [
    {
      uni: "İTÜ",
      dept: "Bilgisayar Müh.",
      name: "E.B.",
      year: 2025,
      photo: "/students/1.jpg",
    },
    {
      uni: "ODTÜ",
      dept: "Elektrik-Elektronik",
      name: "M.K.",
      year: 2025,
      photo: "/students/2.png",
    },
    {
      uni: "Hacettepe",
      dept: "Tıp",
      name: "S.A.",
      year: 2025,
      photo: "/students/3.jpg",
    },
  ];

  return (
    <section
      id="basarilar"
      className={`${styles.section} ${styles.success}`}
    >
      <Container>
        <h2 className={styles.sectionTitle}>Başarılarımız</h2>
        <div className={`${styles.grid} ${styles.gridTopGap}`}>
          {winners.map((s, i) => (
            <article key={i} className={styles.successCard}>
              <img
                className={styles.sPhoto}
                src={s.photo}
                alt={`${s.name} - ${s.uni}`}
                width={1200}
                height={900}
              />
              <div className={styles.sBody}>
                <div className={styles.sMeta}>{s.year} Yerleşen</div>
                <div className={styles.sUni}>
                  {s.uni} – {s.dept}
                </div>
                <div style={{ color: "#374151", marginTop: 4 }}>
                  Öğrenci: {s.name}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
