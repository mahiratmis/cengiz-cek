import DemoLanding from "./DemoLanding";
import { prisma } from "@/lib/prisma";

export default async function Home({searchParams}) {

  const sp = await searchParams;

  const slug =
    typeof sp?.sube === "string" && sp.sube.trim() !== ""
      ? sp.sube
      : "guzelyali_yks"; // varsayılan şube

  const branch = await prisma.branch.findUnique({
    where: { slug },
  });


  if (!branch) {
    // Şube bulunamazsa boş veriyle açsın, kırılmasın
    return (
      <DemoLanding
        announcements={[]}
        staff={[]}
        successStories={[]}
        contactBranch={null}
      />
    );
  }


  const now = new Date();

  const sliderItems = await prisma.sliderItem.findMany({
    where: {
      branchId: branch.id,
      isActive: true,
    },
    orderBy: { priority: "asc" },
  });


  const announcements = await prisma.announcement.findMany({
    where: {
      branchId: branch.id,
      isPublished: true,
      OR: [{ publishAt: null }, { publishAt: { lte: now } }],
    },
    orderBy: { publishAt: "desc" },
    take: 3,
  });

  const staff = await prisma.staff.findMany({
    where: { branchId: branch.id, isActive: true },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  const successStories = await prisma.successStory.findMany({
    where: { branchId: branch.id, isFeatured: true },
    orderBy: [{ year: "desc" }, { priority: "desc" }],
    take: 6,
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { approvedAt: "desc" },
    take: 8,
  });

  return (
    <DemoLanding
      announcements={announcements}
      staff={staff}
      successStories={successStories}
      contactBranch={branch}
      testimonials={testimonials}
      sliderItems={sliderItems}
    />
  );
}
