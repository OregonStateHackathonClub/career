"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, User } from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Application, User as PrismaUser } from "@prisma/client";

interface ApplicationWithUser extends Application {
  user: PrismaUser;
}

const ITEMS_PER_PAGE = 8;

export default function SponsorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState<ApplicationWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setApplications(data.applications || []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    if (!searchTerm) return applications;

    return applications.filter((app) =>
      app.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [applications, searchTerm]);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = filteredApplications.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="px-6 pb-8">
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="px-6 pb-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">BeaverHacks Attendees</h1>
          <div className="flex gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 rounded-full h-12"
              />
            </div>
            <Button asChild className="bg-osu-orange hover:bg-osu-orange/90">
              <a href="/api/resumes" download>
                Bulk Download Resumes
              </a>
            </Button>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No applications found matching your search."
                : "No applications available."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {paginatedApplications.map((application) => (
                <div
                  key={application.id}
                  className="relative bg-card hover:bg-card/80 border border-border rounded-lg p-6 flex gap-4 transition-colors duration-200"
                >
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">
                      {application.user.name}
                    </h3>
                    <div className="space-y-1 text-sm mb-4">
                      <p>
                        <span className="font-medium">Email: </span>
                        <span className="text-muted-foreground">
                          {application.user.email}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">University: </span>
                        <span className="text-muted-foreground">
                          {application.university}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Graduation: </span>
                        <span className="text-muted-foreground">
                          {application.graduationYear}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Shirt Size: </span>
                        <span className="text-muted-foreground">
                          {application.shirtSize}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Status: </span>
                        <span className="text-muted-foreground">
                          {application.status}
                        </span>
                      </p>
                    </div>
                    <Button
                      asChild
                      className="bg-osu-orange hover:bg-osu-orange/90"
                      size="sm"
                    >
                      <a
                        href={`/api/resumes/${application.resumePath}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Resume
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && handlePageChange(page - 1)}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;

                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1);

                    // Show ellipsis
                    const showEllipsisBefore = pageNum === page - 2 && page > 3;
                    const showEllipsisAfter =
                      pageNum === page + 2 && page < totalPages - 2;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={page === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        page < totalPages && handlePageChange(page + 1)
                      }
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </main>
    </div>
  );
}
