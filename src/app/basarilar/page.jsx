import Link from "next/link";

export const dynamic = "force-static";

export default function BasarilarPage() {
  const winners = [
    { uni:"İTÜ", dept:"Bilgisayar Müh.", name:"E.B.", year:2025, photo:"/students/1.jpg" },
    { uni:"ODTÜ", dept:"Elektrik-Elektronik", name:"M.K.", year:2025, photo:"/students/2.png" },
    { uni:"Hacettepe", dept:"Tıp", name:"S.A.", year:2025, photo:"/students/3.jpg" },
  ];

  return (
    <main style={{ maxWidth: 1120, margin: "40px auto", padding: "0 24px", fontFamily: "system-ui, sans-serif" }}>
      <Link href="/" style={{ textDecoration: "none", color: "#b30000" }}>← Anasayfa</Link>
      <h1 style={{ margin: "16px 0 20px", fontSize: 28, fontWeight: 800 }}>Başarılarımız</h1>

      <div style={{
        display:"grid", gap: 24,
        gridTemplateColumns: "1fr",
        alignItems:"stretch"
      }}>
        {winners.map((s, i) => (
          <article key={i} style={{
            border:"1px solid #f1f5f9", borderRadius:16, overflow:"hidden",
            boxShadow:"0 2px 6px rgba(0,0,0,.06)"
          }}>
            <img src={s.photo} alt={`${s.name} - ${s.uni}`} style={{ width:"100%", maxHeight:300, objectFit:"cover", display:"block" }} />
            <div style={{ padding:"14px 16px" }}>
              <div style={{ fontSize:12, color:"#6b7280", marginBottom:6 }}>{s.year} Yerleşen</div>
              <div style={{ fontWeight:800 }}>{s.uni} – {s.dept}</div>
              <div style={{ color:"#374151", marginTop:4 }}>Öğrenci: {s.name}</div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
