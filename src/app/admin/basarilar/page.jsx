"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BasarilarAdminPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/success-stories")
      .then((r) => r.json())
      .then((data) => setStories(Array.isArray(data) ? data : []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Başarılarımız</h1>
          <p className="admin-muted-text">
            Yerleşen öğrencilerin başarı hikâyelerini buradan yönetin.
          </p>
        </div>
        <Link href="/admin/basarilar/yeni" className="btn-primary">
          + Yeni Başarı
        </Link>
      </div>

      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Yıl</th>
                <th>Öğrenci</th>
                <th>Üniversite</th>
                <th>Bölüm</th>
                <th>Durum</th>
                <th>Sıra</th>
                <th className="admin-table-actions">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((s) => (
                <tr key={s.id}>
                  <td>{s.year}</td>
                  <td>{s.name}</td>
                  <td>{s.uni}</td>
                  <td>{s.dept}</td>
                  <td>
                    {s.isFeatured ? (
                      <span className="badge badge-success">Gösteriliyor</span>
                    ) : (
                      <span className="badge badge-muted">Gizli</span>
                    )}
                  </td>
                  <td>{s.priority}</td>
                  <td className="admin-table-actions">
                    <Link
                      href={`/admin/basarilar/${s.id}`}
                      className="link-small"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
              {stories.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 16 }}>
                    Henüz başarı kaydı eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
