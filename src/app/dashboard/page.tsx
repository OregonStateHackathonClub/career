"use client"
import { useRouter } from "next/navigation"
import { useState } from "react";
import React from "react";
import ProfileCard from "@/components/ProfileCard";
import {EditProfileForm } from "@/components/EditProfileForm";

export default function Dashboard() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  //while using some fake mock data
  const mockUser = {
    name: "Faith Nambasa",
    email: "nambasaf@oregonstate.edu",
    college: "OSU",
    graduation: "Spring 2027",
    skills: ["Javascript", "React", "Typescript"],
    projects: [
      {
        name: "Psych2learn",
        link: "https://devpost.com/nambasaf?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav",
      },
      {
        name: "Elearn",
        link: "https://devpost.com/nambasaf?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav",
      },
    ],
    resumeUrl:
      "https://docs.google.com/document/d/1gBC4hXtdZPTAz0TOzwil7T7xBjeQcNzG1JPNEIWOYpw/edit?usp=sharing",
    website: "www.linkedin.com/in/faith-nambasa-72167a273",
  };

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      {editing ? (
        <EditProfileForm onCancel={() => setEditing(false)} />
      ) : (
        <>
        <ProfileCard {...mockUser} />
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
