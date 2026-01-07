import { prisma } from "@/lib/prisma";

export async function PATCH(req, { params }) {
  const { id } = await params;
  const tid = Number(id);
  if (!Number.isFinite(tid)) {
    return Response.json({ message: "Geçersiz id." }, { status: 400 });
  }

  const b = await req.json();

  // approved true/false
  const approved = Boolean(b.approved);

  const updated = await prisma.testimonial.update({
    where: { id: tid },
    data: {
      approved,
      approvedAt: approved ? new Date() : null,
    },
  });

  return Response.json({ ok: true, item: updated });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const tid = Number(id);
  if (!Number.isFinite(tid)) {
    return Response.json({ message: "Geçersiz id." }, { status: 400 });
  }

  await prisma.testimonial.delete({ where: { id: tid } });
  return Response.json({ ok: true });
}
