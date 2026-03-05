import { NextResponse } from "next/server";
import { prisma } from "../../db";
import { pusherServer } from "@/lib/pusher";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.printer.delete({
      where: { id },
    });

    await pusherServer.trigger("lab-channel", "printers_updated", {});

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete printer" },
      { status: 500 },
    );
  }
}
