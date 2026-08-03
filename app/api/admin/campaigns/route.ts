import { NextResponse } from "next/server";
import { listCampaigns, listMailLogs } from "@/lib/db";

export async function GET() {
  const campaigns = listCampaigns(50);
  const mailLogs = listMailLogs(100);
  return NextResponse.json({ campaigns, mailLogs });
}
