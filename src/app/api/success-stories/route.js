import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stories = await prisma.successStory.findMany({
      where: { isFeatured: true },
      orderBy: [
        { year: "desc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });
    return NextResponse.json(stories);
  } catch (err) {
    console.error("GET /api/success-stories error:", err);
    return NextResponse.json(
      { message: "Başarı listesi alınırken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, year, uni, dept, photoUrl, detail, slug, isFeatured, priority } = body;

    if (!name || !year || !uni || !dept) {
      return NextResponse.json(
        { message: "İsim, yıl, üniversite ve bölüm zorunludur." },
        { status: 400 }
      );
    }

    const story = await prisma.successStory.create({
      data: {
        name,
        year: Number(year),
        uni,
        dept,
        photoUrl: photoUrl || null,
        detail: detail || null,
        slug: slug || null,
        isFeatured: isFeatured ?? true,
        priority: priority ?? 0,
      },
    });

    return NextResponse.json(story, { status: 201 });
  } catch (err) {
    console.error("POST /api/success-stories error:", err);
    return NextResponse.json(
      { message: "Başarı kaydı oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}
