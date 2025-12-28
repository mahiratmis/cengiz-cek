// src/app/admin/page.jsx
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <h2 className="admin-page-title">Genel Bakış</h2>
      <div className="admin-card-grid">
        <DashboardCard
          title="Duyurular"
          description="Yeni duyuru ekle, mevcutları düzenle."
          href="/admin/duyurular"
        />
        <DashboardCard
          title="Öğrenciler"
          description="Öğrenci kayıtlarını yönet."
          href="/admin/ogrenciler"
        />
        <DashboardCard
          title="Veliler"
          description="Veli iletişim bilgilerini takip et."
          href="/admin/veliler"
        />
        <DashboardCard
          title="Kadro"
          description="Öğretmen ve idari kadroyu düzenle."
          href="/admin/kadro"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, href }) {
  return (
    <Link href={href} className="admin-card">
      <h3 className="admin-card-title">{title}</h3>
      <p className="admin-card-text">{description}</p>
    </Link>
  );
}
