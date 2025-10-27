"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-osu-orange/10 via-gray-50 to-white dark:from-[#1a1a1a] dark:via-[#0f0f0f] dark:to-black">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full flex justify-center"
        >
          <Card className="p-10 max-w-lg w-full rounded-3xl shadow-lg border border-border bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-4xl font-bold mb-2">
                BeaverHacks Career
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground mb-6">
                Empowering innovation, connecting talent.
              </CardDescription>
              <Button
                asChild
                className="bg-osu-orange hover:bg-osu-orange/90 text-white px-8 py-3 text-lg rounded-full shadow-md transition"
              >
                <Link href="/portal">Enter Sponsor Portal</Link>
              </Button>
            </CardHeader>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
