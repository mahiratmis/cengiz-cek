import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff) {
      return NextResponse.json({ message: "Kayıt bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(staff);
  } catch (err) {
    console.error("GET /api/staff/[id] error:", err);
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
    const { name, branch, role, photoUrl, bio, priority, isActive } = body;

    const updated = await prisma.staff.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(branch !== undefined && { branch }),
        ...(role !== undefined && { role }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(bio !== undefined && { bio }),
        ...(priority !== undefined && { priority }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/staff/[id] error:", err);
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
    await prisma.staff.delete({ where: { id } });
    return NextResponse.json({ message: "Kayıt silindi." });
  } catch (err) {
    console.error("DELETE /api/staff/[id] error:", err);
    return NextResponse.json(
      { message: "Kayıt silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
