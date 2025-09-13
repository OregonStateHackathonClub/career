// Dashboard Page

"use client"
import { Navbar } from "@/components/navbar"
import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"

import ProfileCard from "@/components/ProfileCard"
import { EditProfileForm } from "@/components/EditProfileForm"
import type { ProfileCardProps } from "@/components/ProfileCard"

export default function Dashboard() {
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<ProfileCardProps | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Load userId from authClient
  useEffect(() => {
    async function loadUserId() {
      const session = await authClient.getSession()
      if (session.data?.user?.id) {
        setUserId(session.data.user.id)
      } else {
        console.error("No user id found in session")
      }
    }
    loadUserId()
  }, [])

  // Fetch user data + signed profile picture URL
  useEffect(() => {
    if (!userId) return

    async function fetchUser() {
      const res = await fetch(`/api/user/${userId}`)
      if (!res.ok) {
        console.log("API returned error status:", res.status)
        return
      }

      const userData = await res.json()
      console.log("API Response:", userData) // Debug log

      let profileUrl: string | undefined

      // Handle profile picture - check both possible field names
      const profilePicturePath = userData.profilePicturePath || userData.image

      if (profilePicturePath) {
        try {
          const picRes = await fetch(`/api/profile-picture/${profilePicturePath}`)
          if (picRes.ok) {
            const data = await picRes.json()
            profileUrl = data.url
          } else {
            console.log("Failed to get signed URL for profile picture")
          }
        } catch (err) {
          console.error("Error fetching signed URL:", err)
        }
      }

      // Handle the nested structure from API
      const userInfo = userData.user || userData // Fallback to userData if no nested user
      const careerInfo = userData // The career profile data

      setUser({
        // Use data from nested user object or fallback to career profile
        name: userInfo.name || `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() || "Name not set",
        email: userInfo.email || "Email not set",

        // Use data from career profile
        college: careerInfo.college || "College not set",
        graduation: careerInfo.graduation || "Graduation not set",
        userid: careerInfo.studentId || userInfo.id || userId,
        skills: careerInfo.skills || [],
        projects: careerInfo.projects || [],

        // Handle file paths
        profilepictureUrl: profileUrl,
        resumeUrl: careerInfo.resumePath,
        website: careerInfo.website,
      })
    }

    fetchUser()
  }, [userId, editing])

  return (
    <>
      <Navbar />

      <main className="dashboard-bg p-4 pl-10">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">Profile</h1>
        {editing ? (
          <EditProfileForm onCancel={() => setEditing(false)} userId={userId || undefined} />
        ) : (
          <>
            {user ? (
              <div className="flex flex-col items-center gap-8 max-w-6xl mx-auto">
                {/* Profile Card Section */}
                <div className="w-full">
                  <ProfileCard {...user} />

                  <div className="flex justify-center mt-4">
                    <button
                      className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Resume Section */}
                {user.resumeUrl && (
                  <div className="w-full max-w-4xl mx-auto">
                    <div className="bg-black border border-gray-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Resume</h2>
                        <a
                          href={`/api/resume-download/${user.resumeUrl}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                          Download PDF
                        </a>
                      </div>

                      <div className="bg-white rounded-lg overflow-hidden">
                        <iframe
                          src={`/api/resume-download/${user.resumeUrl}`}
                          width="100%"
                          height="600px"
                          title="Resume Preview"
                          className="border-0"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white">No user profile found. Please edit your profile.</p>
            )}
          </>
        )}
      </main>
    </>
  )
}
