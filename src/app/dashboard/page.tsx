"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import React from "react";
import ProfileCard from "@/components/ProfileCard";
import { EditProfileForm } from "@/components/EditProfileForm";
import type { ProfileCardProps } from "@/components/ProfileCard";

const userId = "912345678"
export default function Dashboard() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<ProfileCardProps | null>(null);
  useEffect(() => {
    async function fetchUser() {
      // USERID
      const res = await fetch(`/api/dashboard/${userId}`);
      if (res.ok) {
        const user = await res.json();
        setUser(user);
      }
    }
    fetchUser();
  }, [editing]);      // reloading when editing changes

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
