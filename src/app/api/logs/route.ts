import { NextResponse } from "next/server";
import { prisma } from "../db";

export async function GET() {
  try {
    const logs = await prisma.usageLog.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}
