import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isNowInRange(now, startAt, endAt) {
  const afterStart = !startAt || startAt <= now;
  const beforeEnd = !endAt || now <= endAt;
  return afterStart && beforeEnd;
}

export async function GET() {
  try {
    const now = new Date();

    // En yeni aktif popuptan başlayıp ilk uygun olanı seçelim
    const candidates = await prisma.specialPopup.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });

    const active = candidates.find((p) => isNowInRange(now, p.startAt, p.endAt));

    return NextResponse.json(active || null);
  } catch (e) {
    console.error("GET /api/special-popup error:", e);
    return NextResponse.json({ message: "Popup alınamadı" }, { status: 500 });
  }
}
