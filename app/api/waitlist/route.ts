import { NextResponse } from "next/server";
import { sendMail, smtpReady } from "@/lib/mail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9][0-9\s\-()]{5,16}$/;
const VALID_ROLES = ["event_planner", "decorator", "venue_staff", "other_creative_pro"];

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const { email, firstName, lastName, role, phone, whatsappOn } = body || {};

  // Validation
  const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const cleanFirst = typeof firstName === "string" ? firstName.trim() : "";
  const cleanLast = typeof lastName === "string" ? lastName.trim() : "";
  const cleanPhone = typeof phone === "string" ? phone.trim() : "";
  const cleanRole = typeof role === "string" && VALID_ROLES.includes(role) ? role : "event_planner";

  if (!cleanFirst) {
    return NextResponse.json(
      { ok: false, message: "First name is required." },
      { status: 400 }
    );
  }

  if (!cleanLast) {
    return NextResponse.json(
      { ok: false, message: "Last name is required." },
      { status: 400 }
    );
  }

  if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid work email address." },
      { status: 400 }
    );
  }

  if (!cleanPhone || !PHONE_RE.test(cleanPhone.replace(/^\+/, ""))) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid WhatsApp phone number." },
      { status: 400 }
    );
  }

  // 1. Post to Render backend
  const backendBaseUrl = (
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://eventspacepro-backend.onrender.com"
  ).replace(/\/$/, "");

  const payload = {
    email: cleanEmail,
    firstName: cleanFirst,
    lastName: cleanLast,
    name: `${cleanFirst} ${cleanLast}`,
    role: cleanRole,
    phone: cleanPhone,
    whatsappOn: Boolean(whatsappOn),
    feedbackGroupConsentAt: new Date().toISOString(),
  };

  let backendRes: Response;
  try {
    backendRes = await fetch(`${backendBaseUrl}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    console.error("[Waitlist API] Backend fetch error:", err);
    return NextResponse.json(
      { ok: false, message: "Cannot reach the waitlist server. Please try again." },
      { status: 502 }
    );
  }

  let backendData: any = null;
  try {
    backendData = await backendRes.json();
  } catch {}

  // Handle duplicate email (409)
  if (backendRes.status === 409) {
    return NextResponse.json(
      {
        ok: false,
        status: 409,
        message: "This email is already registered on the waitlist. You can continue to log in or sign up.",
        isDuplicate: true,
      },
      { status: 409 }
    );
  }

  // Handle rate limiting (429)
  if (backendRes.status === 429) {
    const retryAfter =
      typeof backendData?.retryAfter === "number" ? Math.max(1, backendData.retryAfter) : 60;
    const minutes = Math.ceil(retryAfter / 60);
    return NextResponse.json(
      {
        ok: false,
        status: 429,
        message: `Too many sign-ups from this connection. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      },
      { status: 429 }
    );
  }

  if (!backendRes.ok) {
    const errorMsg =
      backendData?.message || backendData?.error || "We couldn't add you right now. Please try again.";
    return NextResponse.json(
      { ok: false, status: backendRes.status, message: errorMsg },
      { status: backendRes.status }
    );
  }

  // 2. If successfully added, send confirmation/welcome email with the website link
  if (smtpReady()) {
    try {
      await sendMail({
        to: cleanEmail,
        subject: "Welcome to EventSpacePro — Your Early Access Link",
        text: `Hello ${cleanFirst},\n\nThank you for joining early access for EventSpacePro!\n\nYou can access the website and get started using the links below:\n\n• Website: https://www.eventspacepro.com\n• Sign Up / App: https://app.eventspacepro.com/auth/signup\n• Tutorials: https://www.eventspacepro.com/tutorials\n• WhatsApp Channel: https://whatsapp.com/channel/0029VbDahNlLdQej7Bpe5L3t\n\nIf you have any feedback or questions, feel free to reply to this email.\n\nBest regards,\nThe EventSpacePro Team\nSee the space before it's set.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; color: #021938; padding: 24px; line-height: 1.6;">
            <div style="margin-bottom: 24px;">
              <img src="https://www.eventspacepro.com/assets/mainLogo.svg" alt="EventSpacePro" width="140" style="display: block; margin-bottom: 8px;" />
              <p style="margin: 0; font-size: 14px; color: #556074;">See the space before it's set.</p>
            </div>
            
            <h2 style="font-size: 22px; color: #021938; margin-top: 0;">Welcome to EventSpacePro, ${cleanFirst}!</h2>
            
            <p style="font-size: 16px; color: #33405a;">
              You have successfully joined early access. You can now explore the 2D floor-plan editor, use the AI layout assistant, and start drafting to-scale event spaces right away.
            </p>
            
            <div style="background: #f7f9fc; border: 1px solid #dfe4ee; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 12px; font-weight: 600; font-size: 15px; color: #021938;">Quick Access Links:</p>
              <ul style="margin: 0; padding-left: 20px; color: #556074; font-size: 15px;">
                <li style="margin-bottom: 8px;">
                  <a href="https://app.eventspacepro.com/auth/signup" style="color: #0056A9; font-weight: 600; text-decoration: none;">Create Your Account (Sign Up) &rarr;</a>
                </li>
                <li style="margin-bottom: 8px;">
                  <a href="https://www.eventspacepro.com" style="color: #0056A9; text-decoration: none;">Official Website &rarr;</a>
                </li>
                <li style="margin-bottom: 8px;">
                  <a href="https://www.eventspacepro.com/tutorials" style="color: #0056A9; text-decoration: none;">Step-by-Step Video Tutorials &rarr;</a>
                </li>
                <li>
                  <a href="https://whatsapp.com/channel/0029VbDahNlLdQej7Bpe5L3t" style="color: #0056A9; text-decoration: none;">Join the WhatsApp Channel &rarr;</a>
                </li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://app.eventspacepro.com/auth/signup" style="display: inline-block; background: #0056A9; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; padding: 14px 28px; border-radius: 12px;">Get Started Now</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dfe4ee; margin: 32px 0;" />
            
            <p style="font-size: 13px; color: #8a93a3; margin: 0;">
              &copy; 2026 EventSpacePro · A product of AB Imaging Concepts. Lagos.
            </p>
          </div>
        `,
      });
      console.log(`[Waitlist API] Welcome email successfully sent to ${cleanEmail}`);
    } catch (mailErr: any) {
      console.warn("[Waitlist API] Could not send welcome email:", mailErr.message);
    }
  } else {
    console.log("[Waitlist API] SMTP not configured on server; skipped sending welcome email.");
  }

  return NextResponse.json({
    ok: true,
    status: 201,
    message: "You're in! We've also emailed you the link.",
    data: backendData?.data,
  });
}
