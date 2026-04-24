"use client";

import Image from "next/image";
import AuthHeader from "@/components/layout/AuthHeader";
import AuthForm from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image - Full Screen */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/auth/image.png"
          alt="NOVEX Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      {/* Header */}
      <AuthHeader />

      {/* Auth Form - Dynamic positioning based on step */}
      <div className="relative z-10 min-h-[calc(100vh-100px)] px-8">
        <AuthForm />
      </div>
    </div>
  );
}
