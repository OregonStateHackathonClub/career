"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await authClient.getSession();
        setIsAuthenticated(!!session.data?.user);
      } catch {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, [pathname]); // runs every time the route changes

  return (
    <header className="flex items-center justify-between p-6 bg-black text-white">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center">
          <Image
            src="/beaverhacks_logo.jpg"
            width={64}
            height={64}
            alt="BeaverHacks Logo"
          />
        </div>
        <div>
          <div className="text-lg font-bold">BEAVERHACKS</div>
          <div className="text-lg font-bold">CAREER</div>
        </div>
      </Link>

      <nav className="flex items-center gap-8">
        <Link
          href="/user-dashboard"
          className="text-lg hover:text-gray-300 transition-colors"
        >
          Discover
        </Link>

        {isAuthenticated === null ? (
          <span className="text-gray-400">Loading...</span>
        ) : isAuthenticated ? (
          <Link
            href="/dashboard"
            className="text-lg hover:text-gray-300 transition-colors"
          >
            Profile
          </Link>
        ) : (
          <>
            <Link
              href="/signup"
              className="text-lg hover:text-gray-300 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/signin"
              className="text-lg hover:text-gray-300 transition-colors"
            >
              Sign In
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};
