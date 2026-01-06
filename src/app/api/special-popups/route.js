import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function requireAdmin(req) {
  const adminSession = req.cookies.get("admin_session")?.value;
  return !!adminSession;
}

function parseDT(dtLocal) {
  if (!dtLocal) return null;
  const d = new Date(dtLocal);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(req) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
    }

    const latest = await prisma.specialPopup.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(latest || null);
  } catch (e) {
    console.error("GET /api/special-popups error:", e);
    return NextResponse.json({ message: "Popup alınamadı" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      imageUrl,
      imagePublicId,
      isActive,
      startAt,
      endAt,
    } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { message: "imageUrl zorunlu" },
        { status: 400 }
      );
    }

    const created = await prisma.specialPopup.create({
      data: {
        title: title || null,
        description: description || null,
        imageUrl,
        imagePublicId: imagePublicId || null,
        isActive: Boolean(isActive),
        startAt: parseDT(startAt),
        endAt: parseDT(endAt),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("POST /api/special-popups error:", e);
    return NextResponse.json({ message: "Popup oluşturulamadı" }, { status: 500 });
  }
}
