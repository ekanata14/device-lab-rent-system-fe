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

    if (printer.nextReservation) {
      return NextResponse.json({ error: "Queue is full" }, { status: 400 });
    }

    const updatedPrinter = await prisma.printer.update({
      where: { id },
      data: {
        nextReservation: reservation,
      },
    });

    await pusherServer.trigger("lab-channel", "printers_updated", {});

    return NextResponse.json(updatedPrinter, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to queue reservation" },
      { status: 500 },
    );
  }
}
