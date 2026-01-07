import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const branchStr = searchParams.get("branch");
  const branchId = branchStr ? Number(branchStr) : null;

  if (!branchId || Number.isNaN(branchId)) {
    return NextResponse.json({ message: "branch zorunlu" }, { status: 400 });
  }

  const items = await prisma.sliderItem.findMany({
    where: { branchId },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(items);
}

export async function POST(req) {
  const body = await req.json();
  const { title, linkUrl, imageUrl, imagePublicId, isActive, priority, branchId } = body;

  if (!imageUrl || !branchId) {
    return NextResponse.json(
      { message: "imageUrl ve branchId zorunlu" },
      { status: 400 }
    );
  }

  const created = await prisma.sliderItem.create({
    data: {
      title: title || null,
      linkUrl: linkUrl || null,
      imageUrl,
      imagePublicId: imagePublicId || null,
      isActive: isActive ?? true,
      priority: priority ?? 0,
      branch: { connect: { id: Number(branchId) } },
    },
  });

  return NextResponse.json(created, { status: 201 });
}
