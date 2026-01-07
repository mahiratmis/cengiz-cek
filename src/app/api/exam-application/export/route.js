import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    // 🔐 Admin koruması
    const adminSession = req.cookies.get("admin_session")?.value;
    if (!adminSession) {
      return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch");
    const where = branch ? { branchId: Number(branch) } : {};

    // ⚠️ Model adını gerekirse değiştir
    const rows = await prisma.examApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // 📘 Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Cengiz Eğitim";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Sınav Başvuruları", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    // 🧾 Kolonlar
    sheet.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "Tarih", key: "createdAt", width: 22 },
      { header: "Ad Soyad", key: "fullName", width: 26 },
      { header: "Telefon", key: "phone", width: 18 },
      { header: "Email", key: "email", width: 14 },
      { header: "Sınıf", key: "grade", width: 14 },
      { header: "Şube ID", key: "branchId", width: 10 },
      { header: "Not", key: "notes", width: 30 },
    ];

    // 🎨 Header stili
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: "middle" };

    // 📥 Satırlar
    rows.forEach((r) => {
      sheet.addRow({
        id: r.id,
        createdAt: r.createdAt
          ? new Date(r.createdAt).toLocaleString("tr-TR")
          : "",
        fullName: r.fullName || "",
        phone: r.phone || "",
        email: r.email || "",
        grade: r.grade || "",
        branchId: r.branchId || "",
        notes: r.notes || "",
      });
    });

    // 🔁 Buffer’a çevir
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="sinav_basvurulari.xlsx"',
      },
    });
  } catch (e) {
    console.error("XLSX export error:", e);
    return NextResponse.json(
      { message: "Excel oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}
