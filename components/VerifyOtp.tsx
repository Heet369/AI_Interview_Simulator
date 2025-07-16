"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const email = useSearchParams().get("email");

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Invalid OTP");

      toast.success("OTP verified, you are now logged in!");
      router.push("/"); // Or navigate to reset password
    } catch (err) {
      toast.error("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="card-border lg:min-w-[566px] p-10">
      <h2 className="text-center text-primary-100 mb-6">Enter OTP</h2>
      <Input
        placeholder="Enter OTP sent to email"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <Button className="btn mt-4 w-full" onClick={handleVerifyOtp}>
        Verify OTP
      </Button>
    </div>
  );
};

export default VerifyOtp;
