"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import React from "react";
import ProfileCard from "@/components/ProfileCard";
import { EditProfileForm } from "@/components/EditProfileForm";
import type { ProfileCardProps } from "@/components/ProfileCard";



export default function Dashboard() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<ProfileCardProps | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      const parsed = JSON.parse(profile);
      setUserId(parsed.userid || parsed.id);

      console.log("Loaded userId from localStorage:", parsed.userid || parsed.id);
    }
}, []);

useEffect(() => {
  if (!userId) return;
  async function fetchUser() {
    const res = await fetch(`/api/dashboard/${userId}`);
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
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {editing ? (
        <EditProfileForm onCancel={() => setEditing(false)} />
      ) : (
          <>
            {user ? (
              <ProfileCard {...user} />
              
            ) : (
                <p>No user profile found. Please edit your profile.</p>
            )
          }
            
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
      </>
    )}
  </main>
  );

}
