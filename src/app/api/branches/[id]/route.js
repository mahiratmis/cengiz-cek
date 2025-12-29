import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req, { params }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz id" }, { status: 400 });
  }

  const branch = await prisma.branch.findUnique({ where: { id } });
  if (!branch) {
    return NextResponse.json({ message: "Şube bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(branch);
}

export async function PATCH(req, { params }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz id" }, { status: 400 });
  }

  const body = await req.json();
  const { name, slug, address, phone, instagram, facebook, whatsapp } = body;

  try {
    const branch = await prisma.branch.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(instagram !== undefined && { instagram }),
        ...(facebook !== undefined && { facebook }),
        ...(whatsapp !== undefined && { whatsapp }),
      },
    });

    return NextResponse.json(branch);
  } catch (err) {
    console.error("PATCH /api/branches/[id] error:", err);
    return NextResponse.json(
      { message: "Şube güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req, { params }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz id" }, { status: 400 });
  }

  try {
    await prisma.branch.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/branches/[id] error:", err);
    return NextResponse.json(
      { message: "Şube silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
