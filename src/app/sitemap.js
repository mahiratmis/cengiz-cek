export default function sitemap() {
    const baseUrl = "https://cengizegitim.com.tr";
  
    // Sitenizde gerçekten olan sayfaları yazın
    const routes = [
      "",
      "/duyurular",
      "/basarilar",
      "/sinav-basvurusu",
    ];
  
    const now = new Date();
  
    return routes.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: path === "" ? 1 : 0.7,
    }));
  }
  