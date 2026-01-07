import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function csvEscape(v) {
  const s = (v ?? "").toString();
  // virgül, tırnak, yeni satır varsa tırnakla sar
  if (/[",\n\r;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export async function GET(req) {
  try {
    // ✅ admin koruması (senin sistemin)
    const adminSession = req.cookies.get("admin_session")?.value;
    if (!adminSession) {
      return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const where = from ? { createdAt: { gte: startOfDay(from), lte: endOfDay(to) }} : {};

    // ⚠️ Burayı kendi başvuru modeline göre düzenle:
    const rows = await prisma.examApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // CSV başlıkları (sende hangi alanlar varsa ona göre ayarla)
    const headers = [
      "ID",
      "Tarih",
      "Ad Soyad",
      "Telefon",
      "Sınıf",
      "Email",
      "ŞubeID",
      "Not",
    ];

    const lines = [];
    lines.push(headers.map(csvEscape).join(";")); // TR Excel için ; daha iyi

    for (const r of rows) {
      lines.push(
        [
          r.id,
          r.createdAt ? new Date(r.createdAt).toLocaleString("tr-TR") : "",
          r.fullName || "",
          r.phone || "",
          r.grade || "",
          r.email || "",          
          r.branchId || "",
          r.notes || "",
        ]
          .map(csvEscape)
          .join(";")
      );
    }

    const csv = "\uFEFF" + lines.join("\n"); // BOM: Türkçe karakter için iyi

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="sinav_basvurulari.csv"`,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Export sırasında hata oluştu." },
      { status: 500 }
    );
  }
}
