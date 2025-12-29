// src/app/api/announcements/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req, { params }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Geçersiz ID" },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: "Duyuru bulunamadı." },
        { status: 404 }
      );
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
  return isNaN(d.getTime()) ? null : d;
}

export async function PATCH(req, { params }) {
  try {
    const id = Number(params.id);
    if (!id) return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });

    const body = await req.json();
    const {
      title,
      slug,
      summary,
      content,
      audience,
      coverImage,
      isPublished,
      publishAt,
    } = body;

    const publishAtDate = parsePublishAt(publishAt);

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(summary !== undefined && { summary }),
        ...(content !== undefined && { content }),
        ...(audience !== undefined && { audience }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
        ...(publishAt !== undefined && { publishAt: publishAtDate }),
      },
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    console.error("ANN PATCH ERROR:", error);
    return NextResponse.json(
      { message: "Duyuru güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}


export async function DELETE(_req, { params }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Geçersiz ID" },
        { status: 400 }
      );
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/announcements/[id] error:", e);
    return NextResponse.json(
      { error: "Duyuru silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
