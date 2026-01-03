"use client";

import { useEffect, useMemo, useState } from "react";

export default function AdminYorumlarPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending"); // pending | approved
  const [err, setErr] = useState("");

  const fetchItems = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`/api/testimonials?status=${tab}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Liste alınamadı.");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const title = useMemo(
    () => (tab === "pending" ? "Onay Bekleyen Yorumlar" : "Onaylı Yorumlar"),
    [tab]
  );

  const approve = async (id) => {
    if (!confirm("Bu yorumu onaylamak istiyor musunuz?")) return;
    await patchApprove(id, true);
  };

  const unapprove = async (id) => {
    if (!confirm("Bu yorumu yayından kaldırmak istiyor musunuz?")) return;
    await patchApprove(id, false);
  };

  const patchApprove = async (id, approved) => {
    setErr("");
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "İşlem başarısız.");

      // listeyi güncelle
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setErr(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Bu yorumu kalıcı olarak silmek istiyor musunuz?")) return;
    setErr("");
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Silinemedi.");

      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{title}</h1>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            className={tab === "pending" ? "btnPrimary" : "btnSecondary"}
            type="button"
            onClick={() => setTab("pending")}
          >
            Onay Bekleyen
          </button>
          <button
            className={tab === "approved" ? "btnPrimary" : "btnSecondary"}
            type="button"
            onClick={() => setTab("approved")}
          >
            Onaylı
          </button>

          <button className="btnSecondary" type="button" onClick={fetchItems}>
            Yenile
          </button>
        </div>
      </div>

      {err ? (
        <div style={{ marginBottom: 12, color: "#b91c1c", fontWeight: 700 }}>
          {err}
        </div>
      ) : null}

      {loading ? (
        <div>Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div style={{ opacity: 0.7 }}>Kayıt yok.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((t) => (
            <div
              key={t.id}
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ fontWeight: 800 }}>
                  {t.fullName}{" "}
                  <span style={{ opacity: 0.65, fontWeight: 700 }}>
                    ({t.type === "student" ? "Öğrenci" : "Veli"})
                  </span>
                </div>

                <div style={{ marginLeft: "auto", opacity: 0.7, fontSize: 13 }}>
                  {new Date(t.createdAt).toLocaleString("tr-TR")}
                </div>
              </div>

              <div style={{ marginTop: 6, opacity: 0.9 }}>
                {t.type === "student" ? (
                  <span style={{ fontSize: 13, opacity: 0.75 }}>
                    Sınıf: <b>{t.grade || "-"}</b>
                  </span>
                ) : (
                  <span style={{ fontSize: 13, opacity: 0.75 }}>
                    Öğrenci: <b>{t.childName || "-"}</b>
                  </span>
                )}
              </div>

              <div style={{ marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {t.message}
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                {tab === "pending" ? (
                  <button className="btnPrimary" type="button" onClick={() => approve(t.id)}>
                    Onayla
                  </button>
                ) : (
                  <button className="btnSecondary" type="button" onClick={() => unapprove(t.id)}>
                    Yayından Kaldır
                  </button>
                )}

                <button className="btnSecondary" type="button" onClick={() => remove(t.id)}>
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
