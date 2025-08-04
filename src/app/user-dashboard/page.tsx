"use client"

import { useEffect, useMemo, useState } from "react"
import Image from 'next/image'
import Link from "next/link"
import { Search, User } from "lucide-react"

import beaverHacksLogo from "../../public/beaverhacks_logo.jpg"
import { Input } from "@/components/ui/input"
import { User as UserType } from "@prisma/client"

const ITEMS_PER_PAGE = 8

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState<UserType[] | null>(null)

  useEffect(() => {
    fetch('/api/get-all-users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users)
      })
  }, [])

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!users) return []

    if (searchTerm) 
      return users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image src={beaverHacksLogo} width={64} height={64} alt="BeaverHacks Logo" />
          </div>
          <div>
            <div className="text-lg font-bold">BEAVERHACKS</div>
            <div className="text-lg font-bold">CAREER</div>
          </div>
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/discover" className="text-lg hover:text-gray-300 transition-colors">
            Discover
          </Link>
          <Link href="/profile" className="text-lg hover:text-gray-300 transition-colors">
            Profile
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-8">
        {/* Title and Search */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Discover User Profiles</h1>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-gray-600 border-gray-500 text-white placeholder-gray-400 rounded-full h-12"
            />
          </div>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {currentUsers.map((user) => (
            <div key={user.id} className="duration-300 hover:bg-gray-400 bg-gray-300 text-black rounded-lg p-6 flex gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{user.name}</h3>
                <p className="text-sm mb-1">ID: {user.id}</p>
                <p className="text-sm mb-1">Email: {user.email}</p>
              </div>
            </div>
          ))}
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
