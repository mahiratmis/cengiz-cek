"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDuyurularPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const branch =
        typeof window !== "undefined"
          ? window.localStorage.getItem("activeBranch")
          : null;

      const qs = branch ? `?branch=${branch}` : "";
      const res = await fetch(`/api/announcements${qs}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Duyurular alınamadı.");
      }

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
    // İlk yüklemede
    loadData();

    // Şube değişince yeniden yükle
    const handler = () => {
      loadData();
    };

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
          <h1 className="admin-page-title">Duyurular</h1>
          <p className="admin-muted-text">
            Seçili şube için duyuruları buradan yönetebilirsiniz.
          </p>
        </div>
        <Link href="/admin/duyurular/yeni" className="btn-primary">
          + Yeni Duyuru
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
                <th>Başlık</th>
                <th>Yayın Durumu</th>
                <th>Yayın Tarihi</th>
                <th className="admin-table-actions">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 16 }}>
                    Bu şube için henüz duyuru yok.
                  </td>
                </tr>
              ) : (
                items.map((a) => (
                  <tr key={a.id}>
                    <td>{a.title}</td>
                    <td>
                      {a.isPublished ? (
                        <span className="badge badge-success">Yayında</span>
                      ) : (
                        <span className="badge badge-muted">Taslak</span>
                      )}
                    </td>
                    <td>
                      {a.publishAt
                        ? new Date(a.publishAt).toLocaleDateString("tr-TR")
                        : "-"}
                    </td>
                    <td className="admin-table-actions">
                      <Link
                        href={`/admin/duyurular/${a.id}`}
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
