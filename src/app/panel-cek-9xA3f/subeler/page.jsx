"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminSubelerPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then(setBranches)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Şubeler</h1>
        <Link href="/panel-cek-9xA3f/subeler/yeni" className="btn-success">+ Yeni Şube</Link>
      </div>

      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Slug</th>
                <th>Telefon</th>
                <th className="admin-table-actions">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {branches.length === 0 && (
                <tr><td colSpan={4}>Henüz şube yok.</td></tr>
              )}
              {branches.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{b.slug}</td>
                  <td>{b.phone || "-"}</td>
                  <td className="admin-table-actions">
                    <Link className="link-small" href={`/panel-cek-9xA3f/subeler/${b.id}`}>
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
