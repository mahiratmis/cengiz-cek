import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      where: { isActive: true },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });
    return NextResponse.json(staff);
  } catch (err) {
    console.error("GET /api/staff error:", err);
    return NextResponse.json(
      { message: "Kadro listesi alınırken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, branch, role, photoUrl, bio, priority, isActive } = body;

    if (!name || !branch) {
      return NextResponse.json(
        { message: "İsim ve branş zorunludur." },
        { status: 400 }
      );
    }

    const created = await prisma.staff.create({
      data: {
        name,
        branch,
        role: role || null,
        photoUrl: photoUrl || null,
        bio: bio || null,
        priority: priority ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/staff error:", err);
    return NextResponse.json(
      { message: "Kadro üyesi oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}
