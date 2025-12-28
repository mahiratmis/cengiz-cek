"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function KadroListPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((data) => setStaff(data || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kadro</h1>
          <p className="admin-muted-text">
            Öğretmen ve rehber kadrosunu buradan yönetebilirsiniz.
          </p>
        </div>
        <Link href="/admin/kadro/yeni" className="btn-primary">
          + Yeni Kadro Üyesi
        </Link>
      </div>

      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>İsim</th>
                <th>Branş</th>
                <th>Rol</th>
                <th>Durum</th>
                <th>Sıra</th>
                <th className="admin-table-actions">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.branch}</td>
                  <td>{s.role || "-"}</td>
                  <td>
                    {s.isActive ? (
                      <span className="badge badge-success">Aktif</span>
                    ) : (
                      <span className="badge badge-muted">Pasif</span>
                    )}
                  </td>
                  <td>{s.priority}</td>
                  <td className="admin-table-actions">
                    <Link
                      href={`/admin/kadro/${s.id}`}
                      className="link-small"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}

              {staff.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 16 }}>
                    Henüz kadro eklenmemiş.
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
