// src/app/admin/layout.jsx
export const metadata = {
    title: "Cengiz Eğitim Kurumları | Admin",
  };
  
  export default function AdminLayout({ children }) {
    return (
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <span className="admin-brand">
              Cengiz Eğitim | Admin
            </span>
          </div>
          <nav className="admin-nav">
            <a href="/admin" className="admin-nav-link">
              🏠 Dashboard
            </a>
            <a href="/admin/duyurular" className="admin-nav-link">
              📢 Duyurular
            </a>
            <a href="/admin/ogrenciler" className="admin-nav-link">
              🎓 Öğrenciler
            </a>
            <a href="/admin/veliler" className="admin-nav-link">
              👨‍👩‍👧 Veliler
            </a>
            <a href="/admin/kadro" className="admin-nav-link">
              👩‍🏫 Kadro
            </a>
            <a href="/admin/basarilar" className="admin-nav-link">
              🏆 Başarılarımız
            </a>
          </nav>
        </aside>
  
        {/* Main */}
        <main className="admin-main">
          <header className="admin-header">
            <h1 className="admin-header-title">Yönetim Paneli</h1>
            <a href="/" className="btn-secondary">🌐 Siteye Dön </a>            
          </header>
          <div className="admin-content">{children}</div>
        </main>
      </div>
    );
  }
  