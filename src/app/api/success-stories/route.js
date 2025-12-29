import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const branch = searchParams.get("branch");

  const where = branch ? { branchId: Number(branch) } : {};
  try {
    const stories = await prisma.successStory.findMany({
      where,
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
    const { name, year, uni, dept, photoUrl, detail, slug, isFeatured, priority, branchId } = body;

    if (!name || !year || !uni || !dept || !branchId) {
      return NextResponse.json(
        { message: "İsim, yıl, üniversite, şube ve bölüm zorunludur." },
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
        branch: {
            connect: { id: Number(branchId) }, // ⭐️ burada bağlıyoruz
          },        
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
