import { NextResponse } from "next/server";
import { prisma } from "../db";
import { pusherServer } from "@/lib/pusher";

export async function GET() {
  try {
    let settings = await prisma.labSettings.findUnique({ where: { id: 1 } });

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.labSettings.create({
        data: {
          id: 1,
          isManuallyClosed: false,
          openTime: "08:00",
          closeTime: "17:00",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const newSettings = await request.json();

    const settings = await prisma.labSettings.upsert({
      where: { id: 1 },
      update: newSettings,
      create: {
        id: 1,
        isManuallyClosed: newSettings.isManuallyClosed ?? false,
        openTime: newSettings.openTime ?? "08:00",
        closeTime: newSettings.closeTime ?? "17:00",
      },
    });

    await pusherServer.trigger("lab-channel", "printers_updated", {});

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
