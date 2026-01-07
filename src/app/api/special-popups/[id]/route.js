import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

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

export async function PATCH(req, { params }) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
    }

    const id = Number(params.id);
    if (!id) return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });

    const current = await prisma.specialPopup.findUnique({
      where: { id },
      select: { imagePublicId: true },
    });
    if (!current) return NextResponse.json({ message: "Bulunamadı" }, { status: 404 });

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

    // Görsel değiştiyse eskiyi sil
    if (
      imagePublicId &&
      current.imagePublicId &&
      imagePublicId !== current.imagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(current.imagePublicId, { resource_type: "image" });
      } catch (e) {
        console.warn("Cloudinary eski popup görseli silinemedi:", e);
      }
    }

    const updated = await prisma.specialPopup.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title || null }),
        ...(description !== undefined && { description: description || null }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(imagePublicId !== undefined && { imagePublicId: imagePublicId || null }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(startAt !== undefined && { startAt: parseDT(startAt) }),
        ...(endAt !== undefined && { endAt: parseDT(endAt) }),
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /api/special-popups/[id] error:", e);
    return NextResponse.json({ message: "Popup güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
    }

    const id = Number(params.id);
    if (!id) return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });

    const current = await prisma.specialPopup.findUnique({
      where: { id },
      select: { imagePublicId: true },
    });
    if (!current) return NextResponse.json({ message: "Bulunamadı" }, { status: 404 });

    if (current.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(current.imagePublicId, { resource_type: "image" });
      } catch (e) {
        console.warn("Cloudinary popup görseli silinemedi:", e);
      }
    }

    await prisma.specialPopup.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/special-popups/[id] error:", e);
    return NextResponse.json({ message: "Popup silinemedi" }, { status: 500 });
  }
}
