// src/app/api/announcements/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
    }

    const announcement = await prisma.announcement.findUnique({ where: { id } });

    if (!announcement) {
      return NextResponse.json({ error: "Duyuru bulunamadı." }, { status: 404 });
    }

    return NextResponse.json(announcement);
  } catch (e) {
    console.error("GET /api/announcements/[id] error:", e);
    return NextResponse.json(
      { error: "Duyuru alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

function parsePublishAt(publishAt) {
  if (!publishAt) return null;
  const d = new Date(publishAt);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function PATCH(req, { params }) {
  try {
    const prms = await params;
    const id = Number(prms.id);
    if (Number.isNaN(id) || id <= 0) {
      return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
    }

    const body = await req.json();

    const {
      title,
      slug,
      summary,
      content,
      audience,

      // ✅ yeni alanlar (admin payload’dan bunları gönder)
      coverImageUrl,
      coverImagePublicId,
      isPublished,
      publishAt,
    } = body;

    // Mevcut kaydı çek (eski cover'ı silebilmek için)
    const current = await prisma.announcement.findUnique({
      where: { id },
      select: { coverImagePublicId: true },
    });

    if (!current) {
      return NextResponse.json({ message: "Kayıt bulunamadı." }, { status: 404 });
    }

    // Eğer yeni cover geldi ve eskisinden farklıysa => eskiyi sil
    if (
      coverImagePublicId &&
      current?.coverImagePublicId &&
      coverImagePublicId !== current.coverImagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(current.coverImagePublicId, {
          resource_type: "image",
        });
      } catch (e) {
        // Silme hatası update'i boğmasın (istersen istersen 500 yaparsın)
        console.warn("Cloudinary eski cover silinemedi:", e);
      }
    }

    const publishAtDate =
      publishAt !== undefined ? parsePublishAt(publishAt) : undefined;

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(summary !== undefined && { summary }),
        ...(content !== undefined && { content }),
        ...(audience !== undefined && { audience }),

        ...(coverImageUrl !== undefined && {coverImageUrl: coverImageUrl || null, }),
        ...(coverImagePublicId !== undefined && {coverImagePublicId: coverImagePublicId || null,}),

        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
        ...(publishAt !== undefined && { publishAt: publishAtDate }),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/announcements/[id] error:", error);
    return NextResponse.json(
      { message: "Duyuru güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id) || id <= 0) {
      return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
    }

    // Silmeden önce cover'ı da sil
    const current = await prisma.announcement.findUnique({
      where: { id },
      select: { coverImagePublicId: true },
    });

    if (current?.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(current.coverImagePublicId, {
          resource_type: "image",
        });
      } catch (e) {
        console.warn("Cloudinary cover silinemedi:", e);
      }
    }

    await prisma.announcement.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/announcements/[id] error:", e);
    return NextResponse.json(
      { error: "Duyuru silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
