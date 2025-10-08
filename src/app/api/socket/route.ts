import { NextRequest, NextResponse } from "next/server";
import initSocket from "@/lib/socket";

export async function GET(req: NextRequest) {
  // @ts-ignore
  initSocket(req, { socket: { server: (global as any).server } });
  return NextResponse.json({ message: "Socket initialized" });
}
