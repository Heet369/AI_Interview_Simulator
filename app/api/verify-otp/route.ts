import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  // Compare with DB-stored OTP
  console.log(`Verifying OTP ${otp} for ${email}`);

  const isValid = true; // Replace with real check
  if (!isValid) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
