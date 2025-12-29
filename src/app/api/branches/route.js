import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(branches);
}

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.name || !data.slug) {
      return NextResponse.json(
        { message: "Ad ve slug zorunludur." },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.create({
      data: {
        name: data.name,
        slug: data.slug,
        address: data.address || null,
        phone: data.phone || null,
        instagram: data.instagram || null,
        facebook: data.facebook || null,
        whatsapp: data.whatsapp || null,
        mapEmbedUrl,
      },
    });

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Şube eklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
