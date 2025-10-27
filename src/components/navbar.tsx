"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { FaInstagram, FaDiscord, FaYoutube } from "react-icons/fa";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isSponsorPage = pathname === "/sponsors";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-border backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            width={48}
            height={48}
            alt="BeaverHacks Logo"
            className="rounded"
          />
          <div>
            <span className="block text-xl font-bold leading-tight">
              BeaverHacks Career
            </span>
            <span className="block text-xs text-muted-foreground tracking-wide">
              Oregon State University
            </span>
          </div>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Socials */}
          <div className="flex items-center gap-3">
            <Link
              href="https://www.instagram.com/beaverhacks"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-5 h-5 hover:text-osu-orange transition" />
            </Link>
            <Link
              href="https://www.youtube.com/@osubeaverhacks"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="w-5 h-5 hover:text-osu-orange transition" />
            </Link>
            <Link
              href="https://discord.com/invite/vuepffJxub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDiscord className="w-5 h-5 hover:text-osu-orange transition" />
            </Link>
          </div>

          <ModeToggle />

          {isSponsorPage && (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
