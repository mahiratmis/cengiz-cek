"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const [branches, setBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState(null);
  const [branchesLoading, setBranchesLoading] = useState(true);

  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await fetch("/api/branches");
        const data = await res.json();

        setBranches(Array.isArray(data) ? data : []);

        let savedId = null;
        if (typeof window !== "undefined") {
          savedId = window.localStorage.getItem("activeBranch");
        }

        if (savedId && data.some((b) => b.id === Number(savedId))) {
          setActiveBranch(Number(savedId));
        } else if (data.length) {
          setActiveBranch(data[0].id);
          if (typeof window !== "undefined") {
            window.localStorage.setItem("activeBranch", String(data[0].id));
          }
        }
      } catch (e) {
        console.error("Şubeler alınırken hata:", e);
        setBranches([]);
      } finally {
        setBranchesLoading(false);
      }
    }

    loadBranches();
  }, []);

  const handleBranchChange = (e) => {
    const id = Number(e.target.value);
    setActiveBranch(id);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("activeBranch", String(id));
      // Duyurular / Kadro / Başarılar sayfaları bu event’i dinleyip yeniden fetch ediyor
      window.dispatchEvent(new CustomEvent("branch-changed", { detail: id }));
    }
  };

  return (
    <div className="admin-layout">
      {/* SOL SİDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand">Cengiz Eğitim Kurumu Admin</div>
        </div>

        {/* Şube seçici */}
        <div style={{ padding: 16 }}>
          <label
            style={{
              fontSize: 12,
              marginBottom: 4,
              display: "block",
              color: "#6b7280",
            }}
          >
            Şube
          </label>
          <select
            className="form-input"
            value={activeBranch ?? ""}
            onChange={handleBranchChange}
            disabled={branchesLoading || branches.length === 0}
          >
            {branches.length === 0 && (
              <option value="">Şube yok</option>
            )}
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* MENÜ LİNKLERİ */}
        <nav className="admin-nav">
          <Link href="/panel-cek-9xA3f" className="admin-nav-link">
            🏠 Dashboard
          </Link>
          <Link href="/panel-cek-9xA3f/subeler" className="admin-nav-link">
            📍 Şubeler
          </Link>
          <Link href="/panel-cek-9xA3f/slider" className="admin-nav-link">
          🖼️ Slider
          </Link>                   
          <Link href="/panel-cek-9xA3f/kadro" className="admin-nav-link">
            👩‍🏫 Kadro
          </Link>
          <Link href="/panel-cek-9xA3f/duyurular" className="admin-nav-link">
            📢 Duyurular
          </Link>
          <Link href="/panel-cek-9xA3f/basarilar" className="admin-nav-link">
            🏆 Başarılarımız
          </Link>
          <Link href="/panel-cek-9xA3f/basvurular" className="admin-nav-link">
            📝 Sınav Başvuruları
          </Link>
          <Link href="/panel-cek-9xA3f/yorumlar" className="admin-nav-link">
            💬 Yorumlar
          </Link>
          <Link href="/panel-cek-9xA3f/popup" className="admin-nav-link">
          📅 Özel Gün
          </Link>          

          <button
            className="btn-primary"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin-login";
            }}
          >
            Çıkış Yap
          </button>


         
        </nav>
      </aside>

      {/* SAĞ TARAF: HEADER + İÇERİK */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">Yönetim Paneli</div>
          <a href="/" className="btn-secondary">
            🌐 Siteye Dön
          </a>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
