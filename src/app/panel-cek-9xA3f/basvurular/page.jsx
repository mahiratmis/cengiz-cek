import { prisma } from "@/lib/prisma";
import ExportApplicationsButton from "../components/ExportApplicationsButton";

export const dynamic = "force-dynamic";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function toISODate(d) {
  const x = new Date(d);
  const yyyy = x.getFullYear();
  const mm = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const gradeLabel = (g) => (g === "mezun" ? "Mezun" : `${g}. Sınıf`);


export default async function BasvurularPage({ searchParams }) {

  const params = await searchParams;

  const fromStr = params?.from || "";
  const toStr = params?.to || "";

  const today = new Date();
  const defaultFrom = new Date(today);
  defaultFrom.setDate(today.getDate() - 7);

  const from = fromStr ? startOfDay(fromStr) : startOfDay(defaultFrom);
  const to = toStr ? endOfDay(toStr) : endOfDay(today);

  const items = await prisma.examApplication.findMany({
    where: {
      createdAt: { gte: from, lte: to },
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });



  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
        Sınav Başvuruları
      </h1>

      {/* Filtre */}
      <form
        style={{ display: "flex", gap: 12, alignItems: "end", marginBottom: 16 }}
      >
        <div>
          <label style={labelStyle}>Başlangıç</label>
          <input
            type="date"
            name="from"
            defaultValue={fromStr || toISODate(defaultFrom)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Bitiş</label>
          <input
            type="date"
            name="to"
            defaultValue={toStr || toISODate(today)}
            style={inputStyle}
          />
        </div>
        <div className="btn-row">
            <button type="submit" className="btn-primary">
                Filtrele
            </button>

            <a href="/panel-cek-9xA3f/basvurular" className="btn-secondary">
                Sıfırla
            </a>
        </div>
      </form>

      <div style={{ marginBottom: 10, fontSize: 13 }}>
        Gösterilen aralık: <b>{toISODate(from)}</b> – <b>{toISODate(to)}</b> •
        Toplam: <b>{items.length}</b>
        <ExportApplicationsButton from={fromStr} to={toStr}/>       
      </div>

      {/* TABLO (asıl eksik kalan yer genelde burası) */}
      <div
        style={{
          overflowX: "auto",
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #eee",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 980,
          }}
        >
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <Th>Tarih</Th>
              <Th>Ad Soyad</Th>
              <Th>Sınıf</Th>
              <Th>Telefon</Th>
              <Th>E-posta</Th>
              <Th>Not</Th>
              <Th>KVKK</Th>
              <Th>Durum</Th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 16, opacity: 0.7 }}>
                  Bu aralıkta başvuru yok.
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <tr key={a.id} style={{ borderTop: "1px solid #eee" }}>
                  <Td>{new Date(a.createdAt).toLocaleString("tr-TR")}</Td>
                  <Td>
                    <b>{a.fullName}</b>
                  </Td>
                  <Td>{gradeLabel(a.grade)}</Td>
                  <Td>
                    <a
                      href={`tel:${a.phone}`}
                      style={{ color: "inherit", textDecoration: "underline" }}
                    >
                      {a.phone}
                    </a>
                  </Td>
                  <Td>{a.email || "-"}</Td>
                  <Td style={{ maxWidth: 360, whiteSpace: "pre-wrap" }}>
                    {a.notes || "-"}
                  </Td>
                  <Td>{a.kvkk ? "Evet" : "Hayır"}</Td>
                  <Td>
                    <StatusBadge status={a.status} />
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "12px 14px",
        fontSize: 12,
        letterSpacing: 0.2,
        opacity: 0.8,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, style }) {
  return (
    <td style={{ padding: "12px 14px", verticalAlign: "top", ...style }}>
      {children}
    </td>
  );
}

function StatusBadge({ status }) {
  const s = (status || "new").toLowerCase();
  const map = {
    new: "Yeni",
    called: "Arandı",
    registered: "Kayıt Oldu",
    cancelled: "İptal",
  };
  const label = map[s] || (status || "Yeni");

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        border: "1px solid #ddd",
        fontSize: 12,
        fontWeight: 700,
        background: "#fff",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 12,
  opacity: 0.8,
  marginBottom: 6,
};

const inputStyle = {
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: "10px 12px",
  background: "#fff",
};

const btnStyle = {
  border: "1px solid #111",
  borderRadius: 10,
  padding: "10px 14px",
  background: "#111",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const btnGhostStyle = {
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: "10px 14px",
  background: "#fff",
  color: "#111",
  fontWeight: 700,
};
