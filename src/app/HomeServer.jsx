import DemoLanding from "./DemoLanding";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const now = new Date();

  const announcements = await prisma.announcement.findMany({
    where: {
      isPublished: true,
      OR: [{ publishAt: null }, { publishAt: { lte: now } }],
    },
    orderBy: { publishAt: "desc" },
    take: 3,
  });

  const staff = await prisma.staff.findMany({
    where: { isActive: true },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  const successStories = await prisma.successStory.findMany({
    where: { isFeatured: true },
    orderBy: [{ year: "desc" }, { priority: "desc" }],
    take: 6,
  });

  return (
    <DemoLanding
      announcements={announcements}
      staff={staff}
      successStories={successStories}
    />
  );
}
