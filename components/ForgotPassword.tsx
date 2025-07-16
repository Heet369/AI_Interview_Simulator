"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSendOtp = async () => {
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to send OTP");

      toast.success("OTP sent to your email!");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error("Error sending OTP");
    }
  };

  return (
    <div className="card-border lg:min-w-[566px] p-10">
      <h2 className="text-center text-primary-100 mb-6">Reset Password</h2>
      <Input
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button className="btn mt-4 w-full" onClick={handleSendOtp}>
        Send OTP
      </Button>
    </div>
  );
};

export default ForgotPassword;
