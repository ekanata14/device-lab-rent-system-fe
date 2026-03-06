import { NextResponse } from "next/server";
import { prisma } from "../../db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Whitelist updatable fields to prevent injection
    const updateData: any = {};
    if (data.userName !== undefined) updateData.userName = data.userName;
    if (data.studentId !== undefined) updateData.studentId = data.studentId;
    if (data.usageTime !== undefined)
      updateData.usageTime = parseInt(data.usageTime);
    if (data.statusAtEnd !== undefined)
      updateData.statusAtEnd = data.statusAtEnd;
    if (data.stopReason !== undefined) updateData.stopReason = data.stopReason;

    const updatedLog = await prisma.usageLog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedLog, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update log" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.usageLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete log" },
      { status: 500 },
    );
  }
}
