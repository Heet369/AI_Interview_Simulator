import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to DB or in-memory store (Redis, etc.)
  // Send email using nodemailer/sendgrid here
  console.log(`Sending OTP ${otp} to ${email}`);

  return NextResponse.json({ success: true });
}
