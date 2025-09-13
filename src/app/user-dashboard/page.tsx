"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image";
import { Search, User } from "lucide-react"

import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input"

import { CareerProfile } from "@prisma/client"

// Interface for the user object which has the CareerProfile info of a user, 
// as well as some other attributes not in CareerProfile
interface User extends CareerProfile {
  profilepictureUrl: string,
  user: {
    name: string
  },
  image: string
}

const ITEMS_PER_PAGE = 8

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState<User[] | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/get-all-users');
      const data = await res.json();

      // For each user, fetch their signed profile picture URL
      const usersWithSignedUrls = await Promise.all(
        data.careerProfiles.map(async (user: User) => {
          let profileUrl;

          if (user.profilePicturePath || user.image) {
            try {
              const picRes = await fetch(
                `/api/profile-picture/${user.profilePicturePath || user.image}`
              );
              if (picRes.ok) {
                const { url } = await picRes.json();
                profileUrl = url;
              }
            } catch (err) {
              console.error("Error fetching signed URL:", err);
            }
          }

          return {
            ...user,
            profilepictureUrl: profileUrl,
          };
        })
      );

      setUsers(usersWithSignedUrls);
    }

    fetchUsers();
  }, []);


  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!users) return []

    if (searchTerm) 
      return users.filter((profile) => profile.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    else return users
  }, [users, searchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar/>

      {/* Main Content */}
      <main className="px-6 pb-8">
        {/* Title and Search */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Discover User Profiles</h1>
          <div className="flex gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-primary border-gray-500 text-white placeholder-gray-400 rounded-full h-12"
              />
            </div>
            <a href="/api/resume-download-all" download>
              <button className="rounded-md border border-white/60 px-4 py-2 cursor-pointer hover:scale-105 duration-300 transition">
                Bulk Download Resumes
              </button>
            </a>
          </div>
        </div>


        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {currentUsers.map((profile) => {
            console.log(profile)
            return (
              <div key={profile.id} className="duration-300 relative bg-primary hover:before:opacity-10 before:pointer-events-none before:absolute before:inset-0 before:bg-white before:opacity-0 border-gray-500 bg-primary text-gray-100 rounded-lg p-6 flex gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Image width={64} height={64} src={`${profile.profilepictureUrl}`} alt={"hi"} className="rounded-full" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 text-white">{profile.user.name}</h3>
                  <p className="text-sm mb-1 text-white">
                    <span className="text-white">ID: </span>
                    <span className="text-white/60">{profile.userId}</span>
                  </p>
                  <p className="text-sm mb-1 text-white">
                    <span className="text-white">College: </span>
                    <span className="text-white/60">{profile.college}</span>
                  </p>
                  <p className="text-sm mb-1 text-white">
                    <span className="text-white">Graduation Year: </span>
                    <span className="text-white/60">{profile.graduation}</span>
                  </p>
                  <p className="text-sm mb-1 text-white">
                    <span className="text-white">Skills: </span>
                    <span className="text-white/60">{profile.skills.join(", ")}</span>
                  </p>
                  <a href={`/api/resume-download/${profile.resumePath}`} download target="_blank" rel="noopener noreferrer">
                    <button className="rounded-md hover:scale-105 duration-300 border border-white/60 px-4 py-2 mt-4 cursor-pointer">Download Resume</button>
                  </a>
                </div>
              </div>
            )})}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <span className="text-lg">Page {currentPage}</span>
            <span className="text-lg">→</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">Move to Page</span>
              {[...Array(Math.min(7, totalPages))].map((_, index) => {
                const pageNum = index + 2
                if (pageNum > totalPages) return null
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`text-lg hover:text-gray-300 transition-colors ${
                      currentPage === pageNum ? "text-orange-400" : ""
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {totalPages > 8 && (
                <>
                  <span className="text-lg">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`text-lg hover:text-gray-300 transition-colors ${
                      currentPage === totalPages ? "text-orange-400" : ""
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
