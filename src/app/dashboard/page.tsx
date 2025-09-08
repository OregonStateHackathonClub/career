// Dashboard Page

"use client";
import { Navbar } from "@/components/navbar";
import { useState, useEffect } from "react";
import React from "react";

import ProfileCard from "@/components/ProfileCard";
import { EditProfileForm } from "@/components/EditProfileForm";
import type { ProfileCardProps } from "@/components/ProfileCard";

export default function Dashboard() {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<ProfileCardProps | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load userId from localStorage
  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      const parsed = JSON.parse(profile);
      setUserId(parsed.userid || parsed.id);
    }
  }, []);

  // Fetch user data + signed profile picture URL
  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) {
        console.log("API returned error status:", res.status);
        return;
      }

      const userData = await res.json();
      console.log("API Response:", userData); // Debug log

      let profileUrl: string | undefined;

      // Handle profile picture - check both possible field names
      const profilePicturePath = userData.profilePicturePath || userData.image;
      
      if (profilePicturePath) {
        try {
          const picRes = await fetch(`/api/profile-picture/${profilePicturePath}`);
          if (picRes.ok) {
            const data = await picRes.json();
            profileUrl = data.url;
          } else {
            console.log("Failed to get signed URL for profile picture");
          }
        } catch (err) {
          console.error("Error fetching signed URL:", err);
        }
      }

      // Handle the nested structure from API
      const userInfo = userData.user || userData; // Fallback to userData if no nested user
      const careerInfo = userData; // The career profile data

      setUser({
        // Use data from nested user object or fallback to career profile
        name: userInfo.name || `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || 'Name not set',
        email: userInfo.email || 'Email not set',
        
        // Use data from career profile
        college: careerInfo.college || 'College not set',
        graduation: careerInfo.graduation || 'Graduation not set',
        userid: careerInfo.studentId || userInfo.id || userId,
        skills: careerInfo.skills || [],
        projects: careerInfo.projects || [],
        
        // Handle file paths
        profilepictureUrl: profileUrl,
        resumeUrl: careerInfo.resumePath,
        website: careerInfo.website,
      });
    }

    fetchUser();
  }, [userId, editing]);

  return (
    <>
      <Navbar />

      <main className="dashboard-bg p-4 pl-10">
        <h1 className="text-3xl font-bold mb-6 text-white">Profile</h1>
        {editing ? (
          <EditProfileForm onCancel={() => setEditing(false)} userId={userId || undefined} />
        ) : (
          <>
            {user ? (
              <>
                <ProfileCard {...user} />

                {user.resumeUrl && (
                  <div
                    id="resume-preview"
                    className="mt-8 bg-white rounded shadow p-6"
                  >
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
                      rel="noopener noreferrer"
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