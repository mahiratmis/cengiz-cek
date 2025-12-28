"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DuyuruListesi() {
  const [duyurular, setDuyurular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => setDuyurular(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Duyurular</h2>
        <Link href="/admin/duyurular/yeni" className="btn-primary">
          + Yeni Duyuru
        </Link>
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : duyurular.length === 0 ? (
        <p className="admin-muted-text">
          Henüz duyuru yok. İlk duyuruyu ekleyebilirsiniz.
        </p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Slug</th>
                <th>Hedef</th>
                <th>Durum</th>
                <th className="admin-table-actions">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {duyurular.map((d) => (
                <tr key={d.id}>
                  <td>{d.title}</td>
                  <td className="admin-muted-text">{d.slug}</td>
                  <td>{d.audience || "genel"}</td>
                  <td>
                    {d.isPublished ? (
                      <span className="badge badge-success">Yayında</span>
                    ) : (
                      <span className="badge badge-muted">Taslak</span>
                    )}
                  </td>
                  <td className="admin-table-actions">
                    <Link
                      href={`/admin/duyurular/${d.id}`}
                      className="link-small"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
