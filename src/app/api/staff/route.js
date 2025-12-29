import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch");
    const where = branch ? { branchId: Number(branch) } : {};
  try {
    const staff = await prisma.staff.findMany({
      where,
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
    const { name, branch, role, photoUrl, bio, priority, isActive, branchId } = body;

    if (!name || !branch ||  !branchId) {
      return NextResponse.json(
        { message: "İsim, branş ve şube zorunludur." },
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
        branchRel: {
            connect: { id: Number(branchId) }, // ⭐️ şubeye bağla
          }        
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
