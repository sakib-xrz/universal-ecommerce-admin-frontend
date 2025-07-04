"use client";

import { getUserInfo } from "@/utils/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const user = getUserInfo();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(
        `/${user?.role === "SUPER_ADMIN" ? "super-admin" : role.toLowerCase()}/dashboard`,
      );
    }
  });

  return (
    <div className="flex h-svh items-center justify-center">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  );
}
