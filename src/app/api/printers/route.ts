import { NextResponse } from "next/server";
import { prisma } from "../db";
import { pusherServer } from "@/lib/pusher";

export async function GET() {
  try {
    const printers = await prisma.printer.findMany();
    return NextResponse.json(printers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch printers" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, model } = await request.json();

    // We count printers to generate the ID
    const count = await prisma.printer.count();
    const id = `PRN-${String(count + 1).padStart(3, "0")}`;

    const newPrinter = await prisma.printer.create({
      data: {
        id,
        name,
        model,
        status: "available",
      },
    });

    // Notify clients of the update
    await pusherServer.trigger("lab-channel", "printers_updated", {});

    return NextResponse.json(newPrinter, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create printer" },
      { status: 400 },
    );
  }
}
