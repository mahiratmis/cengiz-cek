"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminBasarilarPage() {
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

      const qs = branch ? `?branch=${branch}` : "";
      const res = await fetch(`/api/success-stories${qs}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Başarı listesi alınamadı.");
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
    // İlk yüklemede verileri çek
    loadData();

    // Şube değiştiğinde yeniden çek
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
          <h1 className="admin-page-title">Başarılarımız</h1>
          <p className="admin-muted-text">
            Seçili şube için yerleşen öğrencilerin başarı hikâyelerini
            buradan yönetebilirsiniz.
          </p>
        </div>
        <Link href="/admin/basarilar/yeni" className="btn-primary">
          + Yeni Başarı Kaydı
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
                <th>Öğrenci</th>
                <th>Yıl</th>
                <th>Üniversite</th>
                <th>Bölüm</th>
                <th>Durum</th>
                <th className="admin-table-actions">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 16 }}>
                    Bu şube için henüz başarı kaydı yok.
                  </td>
                </tr>
              ) : (
                items.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.year}</td>
                    <td>{s.uni}</td>
                    <td>{s.dept}</td>
                    <td>
                      {s.isFeatured ? (
                        <span className="badge badge-success">
                          Öne Çıkan
                        </span>
                      ) : (
                        <span className="badge badge-muted">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="admin-table-actions">
                      <Link
                        href={`/admin/basarilar/${s.id}`}
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
