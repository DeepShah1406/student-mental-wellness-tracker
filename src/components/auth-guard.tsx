"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    // Check auth status
    const isLoggedIn = localStorage.getItem("mindguard_logged_in") === "true";

    if (!isLoggedIn && pathname !== "/login") {
      setAuthorized(false);
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized && pathname !== "/login") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 space-y-4 bg-slate-950 text-slate-100">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm">Authenticating secure session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
