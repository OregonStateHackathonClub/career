"use client";
import  Navbar from "@/components/navbar";

import { useState, useEffect } from "react";
import React from "react";

import ProfileCard from "@/components/ProfileCard";
import { EditProfileForm } from "@/components/EditProfileForm";
import type { ProfileCardProps } from "@/components/ProfileCard";
import Link from "next/link"
import Image from "next/image"

export default function Dashboard() {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<ProfileCardProps | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      const parsed = JSON.parse(profile);
      setUserId(parsed.userid || parsed.id);

      console.log(
        "Loaded userId from localStorage:",
        parsed.userid || parsed.id
      );
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    async function fetchUser() {
      const res = await fetch(`/api/user/${userId}`);
      console.log("Fetching user for userId:", userId, "Status:", res.status);
      if (res.ok) {
        const user = await res.json();
        console.log("Fetched user from API:", user);
        setUser({
          name: user.name,
          email: user.email,
          college: user.college,
          graduation: user.graduation,
          userid: user.id || user.userid,
          skills: user.skills,
          projects: user.projects,
          profilepictureUrl: user.image ? `/uploads/${user.image}` : undefined,
          resumeUrl: user.resumePath,
          website: user.website,
        });
      } else {
        console.log("API returned error status:", res.status);
      }
    }
    fetchUser();
  }, [userId, editing]);

  return (
    <>
      {/* Navigation bar */}
      <header className="flex items-center justify-between p-6 bg-black">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/beaverhacks_logo.jpg"
              alt="BeaverHacks Logo"
              className="h-15 w-15 rounded"
            />
            <div>
              <span className="font-bold uppercase block text-2xl text-white">BEAVERHACKS</span>
              <span className="font-bold uppercase block text-2xl text-white">CAREER</span>
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/discover" className="text-white hover:text-gray-300 transition-colors">
            Discover
          </Link>
          <Link href="/profile" className="text-white hover:text-gray-300 transition-colors">
            Profile
          </Link>

          <Link href="/logout" className="text-white hover:text-gray-300 transition-colors">
            Logout
          </Link>
        </nav>
      </header>


      <main className="dashboard-bg p-4 pl-10">
        <h1 className="text-3xl font-bold mb-6 text-white">Profile</h1>
        {editing ? (
          <EditProfileForm onCancel={() => setEditing(false)} />
        ) : (
          <>
            {user ? (
              <>
                <ProfileCard {...user} />
                {user.resumeUrl && (
                  <div className="mt-8 bg-white rounded shadow p-6">
                    {/* Resume section */}
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Resume
                    </h2>
                    <iframe
                      src={`/api/resume-download/${user.resumeUrl}`}
                      width="100%"
                      height="500px"
                      title="Resume Preview"
                      className="border mb-4"
                    />

                    <a
                      href={`/api/resume-download/${user.resumeUrl}`}
                      download
                      target="_blank"
                      rel="noopener nonreferrer"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Download Resume
                    </a>
                  </div>
                )}
              </>
            ) : (
              <p className="text-white">
                No user profile found. Please edit your profile.
              </p>
            )}

            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          </>
        )}
      </main>
    </>
  );
}
