import { NextResponse } from "next/server";
import { listMailLogs } from "@/lib/db";
import { smtpReady } from "@/lib/mail";

export async function GET() {
  const logs = listMailLogs(10);
  const sent = logs.filter((l) => l.status === "sent").length;
  const failed = logs.filter((l) => l.status === "failed").length;
  return NextResponse.json({
    sent,
    failed,
    smtpConfigured: smtpReady(),
    recentMail: logs,
  });
}
