// src/app/api/announcements/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const branch = Number(searchParams.get("branch"));

  try {
    const announcements = await prisma.announcement.findMany({
      where: { branchId: branch },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch (e) {
    console.error("GET /api/announcements error:", e);
    return NextResponse.json(
      { error: "Duyurular çekilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

function parsePublishAt(publishAt) {
  if (!publishAt) return null;
  const d = new Date(publishAt);
  if (isNaN(d.getTime())) return null;
  return d;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title, slug, summary, content, audience,
      coverImageUrl, coverImagePublicId,
      isPublished, publishAt, branchId
    } = body;

    if (!title || !slug || !content || !branchId) {
      return NextResponse.json(
        { message: "Başlık, slug, branch ve içerik zorunludur." },
        { status: 400 }
      );
    }

    const publishAtDate = parsePublishAt(publishAt);

    const created = await prisma.announcement.create({
      data: {
        title,
        slug,
        summary: summary || null,
        content,
        audience: audience || null,
        coverImageUrl: coverImageUrl || null,
        coverImagePublicId: coverImagePublicId || null,
        isPublished: Boolean(isPublished),
        publishAt: publishAtDate,
        branch: {
          connect: { id: Number(branchId) },
        }
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/announcements error:", err);
    return NextResponse.json(
      { message: "Duyuru oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}
