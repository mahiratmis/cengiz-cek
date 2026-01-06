// src/app/admin/page.jsx
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <h2 className="admin-page-title">Genel Bakış</h2>
      <div className="admin-card-grid">

      <DashboardCard
        title="📍 Şubeler"
        description="Şube bilgilerini düzenle."
        href="/panel-cek-9xA3f/subeler"
      />

      <DashboardCard
        title="🖼️ Slider"
        description="Sınav başvurularını görüntüle ve yönet."
        href="/panel-cek-9xA3f/slider"
      />   

      <DashboardCard
        title="📢 Duyurular"
        description="Yeni duyuru ekle, mevcutları düzenle."
        href="/panel-cek-9xA3f/duyurular"
      />   

      <DashboardCard
        title="👩‍🏫 Kadro"
        description="Öğretmen ve idari kadroyu düzenle."
        href="/panel-cek-9xA3f/kadro"
      />

      <DashboardCard
        title="🏆 Başarılar"
        description="Öğrenci başarılarını düzenle."
        href="/panel-cek-9xA3f/basarilar"
      />



      <DashboardCard
        title="📝 Sınav Başvuruları"
        description="Sınav başvurularını görüntüle ve yönet."
        href="/panel-cek-9xA3f/basvurular"
      />

      <DashboardCard
        title="📅 Özel Gün"
        description="Özel gün içeriği oluştur."
        href="/panel-cek-9xA3f/popup"
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
