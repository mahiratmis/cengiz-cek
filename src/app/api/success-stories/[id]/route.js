import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const story = await prisma.successStory.findUnique({ where: { id } });
    if (!story) {
      return NextResponse.json({ message: "Kayıt bulunamadı." }, { status: 404 });
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
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, year, uni, dept, photoUrl, detail, slug, isFeatured, priority } = body;

    const updated = await prisma.successStory.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(year !== undefined && { year: Number(year) }),
        ...(uni !== undefined && { uni }),
        ...(dept !== undefined && { dept }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(detail !== undefined && { detail }),
        ...(slug !== undefined && { slug }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(priority !== undefined && { priority }),
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
