import { NextResponse } from "next/server";
import { prisma } from "../../../db";
import { pusherServer } from "@/lib/pusher";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const reservation = await request.json();

    const printer = await prisma.printer.findUnique({
      where: { id },
    });

    if (!printer) {
      return NextResponse.json({ error: "Printer not found" }, { status: 404 });
    }

    if (printer.status !== "available") {
      return NextResponse.json(
        { error: "Printer is not available" },
        { status: 400 },
      );
    }

    const durationMs = reservation.durationInMinutes * 60 * 1000;
    const endTime = new Date(Date.now() + durationMs);

    const updatedPrinter = await prisma.printer.update({
      where: { id },
      data: {
        status: "in-use",
        currentUser: reservation,
        endTime: endTime,
        brokenReason: null, // clear old broken reason
      },
    });

    await pusherServer.trigger("lab-channel", "printers_updated", {});

    return NextResponse.json(updatedPrinter, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reserve printer" },
      { status: 500 },
    );
  }
}
