// src/app/api/success-stories/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";


async function destroyWithType(publicId, resource_type) {
  const r = await cloudinary.uploader.destroy(publicId, { resource_type });
  return r?.result; // "ok" | "not found" | ...
}

async function safeDestroy(publicId) {
  if (!publicId) return;

  try {

      result = await destroyWithType(publicId, "image");
      if (result === "ok") return;

      console.error("CV destroy failed:", publicId, "result(raw/image)=", result);
      return;

  } catch (e) {
    console.error("Cloudinary destroy exception:", publicId, e);
  }
}


export async function GET(req, { params }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const story = await prisma.successStory.findUnique({
      where: { id },
    });

    if (!story) {
      return NextResponse.json(
        { message: "Kayıt bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json(story);
  } catch (err) {
    console.error("GET /api/success-stories/[id] error:", err);
    return NextResponse.json(
      { message: "Kayıt alınırken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  const prms = await params
  const id = Number(prms.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const {
      name,
      year,
      uni,
      dept,
      detail,
      slug,
      isFeatured,
      priority,
      photoUrl,
      photoPublicId,
    } = body;

    // 🔹 Önce mevcut kaydı al (eski foto var mı diye bakacağız)
    const existing = await prisma.successStory.findUnique({
      where: { id },
      select: { photoPublicId: true },
    });

    if (!existing) {
      return NextResponse.json({ message: "Kayıt bulunamadı." }, { status: 404 });
    }

    // 🔥 Foto değişmişse → eskisini Cloudinary’den sil
    if (
      photoPublicId &&
      existing?.photoPublicId &&
      photoPublicId !== existing.photoPublicId
    ) {
      
      await safeDestroy(existing.photoPublicId);
    }

    const updated = await prisma.successStory.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(year !== undefined && { year: Number(year) }),
        ...(uni !== undefined && { uni }),
        ...(dept !== undefined && { dept }),
        ...(detail !== undefined && { detail }),
        ...(slug !== undefined && { slug }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(priority !== undefined && { priority }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(photoPublicId !== undefined && { photoPublicId }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/success-stories/[id] error:", err);
    return NextResponse.json(
      { message: "Kayıt güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
  }

  try {
    // 🔹 Önce kaydı al → foto varsa sil
    const existing = await prisma.successStory.findUnique({
      where: { id },
      select: { photoPublicId: true },
    });

    // önce cloudinary dosyalarını sil
    if (existing.photoPublicId) await safeDestroy(existing.photoPublicId);

    await prisma.successStory.delete({ where: { id } });

    return NextResponse.json({ message: "Kayıt silindi." });
  } catch (err) {
    console.error("DELETE /api/success-stories/[id] error:", err);
    return NextResponse.json(
      { message: "Kayıt silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
