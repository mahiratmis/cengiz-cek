"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminSliderPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const branch =
        typeof window !== "undefined"
          ? window.localStorage.getItem("activeBranch")
          : null;

      if (!branch) {
        setItems([]);
        setLoading(false);
        setError("Önce sol menüden bir şube seçmelisiniz.");
        return;
      }

      const res = await fetch(`/api/slider-items?branch=${branch}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Slider listesi alınamadı.");

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Bir hata oluştu.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handler = () => loadData();
    if (typeof window !== "undefined") {
      window.addEventListener("branch-changed", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("branch-changed", handler);
      }
    };
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Slider</h1>
          <p className="admin-muted-text">
            Seçili şube için slider görsellerini buradan yönetebilirsiniz.
          </p>
        </div>

        <Link href="/panel-cek-9xA3f/slider/yeni" className="btn-primary">
          + Yeni Slider Görseli
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Önizleme</th>
                <th>Başlık</th>
                <th>Link</th>
                <th>Öncelik</th>
                <th>Durum</th>
                <th className="admin-table-actions">İşlemler</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 16 }}>
                    Bu şube için slider kaydı yok.
                  </td>
                </tr>
              ) : (
                items.map((s) => (
                  <tr key={s.id}>
                    <td style={{ width: 120 }}>
                      {s.imageUrl ? (
                        <img
                          src={s.imageUrl}
                          alt={s.title || "Slider"}
                          style={{
                            width: 96,
                            height: 54,
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <span style={{ color: "#6b7280", fontSize: 12 }}>
                          Yok
                        </span>
                      )}
                    </td>

                    <td>{s.title || "-"}</td>
                    <td style={{ maxWidth: 260 }}>
                      {s.linkUrl ? (
                        <a
                          href={s.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="link-small"
                          style={{ wordBreak: "break-word" }}
                        >
                          {s.linkUrl}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>{s.priority ?? 0}</td>

                    <td>
                      {s.isActive ? (
                        <span className="badge badge-success">Aktif</span>
                      ) : (
                        <span className="badge badge-muted">Pasif</span>
                      )}
                    </td>

                    <td className="admin-table-actions">
                      <Link
                        href={`/panel-cek-9xA3f/slider/${s.id}`}
                        className="link-small"
                      >
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
