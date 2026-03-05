import { NextResponse } from "next/server";
import { prisma } from "../../../db";
import { pusherServer } from "@/lib/pusher";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { password, reason } = await request.json();

    const printer = await prisma.printer.findUnique({
      where: { id },
    });

    if (!printer) {
      return NextResponse.json({ error: "Printer not found" }, { status: 404 });
    }

    if (!printer.currentUser) {
      return NextResponse.json(
        { error: "No active reservation to stop" },
        { status: 400 },
      );
    }

    const currentUser = printer.currentUser as any;

    // Verify Password
    if (
      currentUser.sessionPassword &&
      currentUser.sessionPassword !== password
    ) {
      if (password !== "admin123") {
        return NextResponse.json(
          { success: false, error: "Invalid password" },
          { status: 401 },
        );
      }
    }

    // Log the usage
    await prisma.usageLog.create({
      data: {
        printerId: printer.id,
        printerName: printer.name,
        userName: currentUser.name,
        studentId: currentUser.studentId,
        usageTime: currentUser.durationInMinutes,
        startTime: new Date(
          new Date(printer.endTime!).getTime() -
            currentUser.durationInMinutes * 60000,
        ),
        endTime: new Date(),
        stopReason: reason || "User finished",
        statusAtEnd: reason ? "force-stopped" : "completed",
      },
    });

    let newStatus = "available";
    let newBufferEndTime = null;
    let newCurrentUser = null;
    let newEndTime = null;

    if (printer.nextReservation) {
      newStatus = "buffer";
      newBufferEndTime = new Date(Date.now() + 5 * 60000);
    }

    const updatedPrinter = await prisma.printer.update({
      where: { id },
      data: {
        status: newStatus,
        bufferEndTime: newBufferEndTime,
        // @ts-ignore
        currentUser: newCurrentUser,
        endTime: newEndTime,
      },
    });

    await pusherServer.trigger("lab-channel", "printers_updated", {});

    return NextResponse.json(
      { success: true, printer: updatedPrinter },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to force stop" },
      { status: 500 },
    );
  }
}
