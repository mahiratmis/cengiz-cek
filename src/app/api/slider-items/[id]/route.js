import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });

  const item = await prisma.sliderItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ message: "Bulunamadı" }, { status: 404 });

  return NextResponse.json(item);
}

export async function PATCH(req, { params }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });

  const body = await req.json();
  const { title, linkUrl, imageUrl, imagePublicId, isActive, priority } = body;

  const current = await prisma.sliderItem.findUnique({
    where: { id },
    select: { imagePublicId: true },
  });

  // görsel değiştiyse eskisini sil
  if (imagePublicId && current?.imagePublicId && imagePublicId !== current.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(current.imagePublicId, { resource_type: "image" });
    } catch (e) {
      console.warn("Cloudinary eski slider görseli silinemedi:", e);
    }
  }

  const updated = await prisma.sliderItem.update({
    where: { id },
    data: {
      ...(title !== undefined && { title: title || null }),
      ...(linkUrl !== undefined && { linkUrl: linkUrl || null }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(imagePublicId !== undefined && { imagePublicId: imagePublicId || null }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      ...(priority !== undefined && { priority: Number(priority) }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });

  const current = await prisma.sliderItem.findUnique({
    where: { id },
    select: { imagePublicId: true },
  });

  if (current?.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(current.imagePublicId, { resource_type: "image" });
    } catch (e) {
      console.warn("Cloudinary slider görseli silinemedi:", e);
    }
  }

  await prisma.sliderItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
