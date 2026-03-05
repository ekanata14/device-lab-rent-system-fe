import { NextResponse } from "next/server";
import { prisma } from "../../../db";
import { pusherServer } from "@/lib/pusher";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const printer = await prisma.printer.findUnique({
      where: { id },
    });

    if (!printer) {
      return NextResponse.json({ error: "Printer not found" }, { status: 404 });
    }

    const updatedPrinter = await prisma.printer.update({
      where: { id },
      data: {
        status: "available",
        brokenReason: null,
        // @ts-ignore
        currentUser: null,
        endTime: null,
      },
    });

    // We keep queue / buffer logic simple for now: if reset, just goes available or grabs queue?
    // Let's just reset to available, and if there's a queue, they have to manually start it.

    await pusherServer.trigger("lab-channel", "printers_updated", {});

    return NextResponse.json(updatedPrinter, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reset printer" },
      { status: 500 },
    );
  }
}
