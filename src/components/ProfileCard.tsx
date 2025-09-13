import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, GraduationCap, Globe, Download, ExternalLink, User } from "lucide-react"

type Project = {
  name: string
  link: string
}

export type ProfileCardProps = {
  name: string
  email: string
  college: string
  graduation: string
  userid: string
  skills: string[]
  projects: Project[]
  resumeUrl: string
  profilepictureUrl?: string
  website?: string
}

function ProfileCard(props: ProfileCardProps) {
  console.log(props.profilepictureUrl)

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-black border-white border">
      <CardContent className="p-0">
        {/* Header Section with Profile Picture and Basic Info */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              {props.profilepictureUrl ? (
                <Image
                  className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-lg"
                  src={props.profilepictureUrl || "/placeholder.svg"}
                  alt={`${props.name}'s profile`}
                  width={96}
                  height={96}
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-300" />
                </div>
              )}
            </div>

            {/* Name and Basic Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">{props.name}</h2>

              <div className="space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{props.email}</span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-300">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm">
                    {props.college} - {props.graduation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6 bg-black">
          {/* Skills Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {props.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs bg-gray-800 text-gray-200 hover:bg-gray-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Projects</h3>
            <div className="space-y-3">
              {props.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800"
                >
                  <span className="font-medium text-white">{project.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Resume and Website Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Resume */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Resume</h3>
              {props.resumeUrl ? (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full justify-start bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <a href={`#resume-preview`} className="flex items-center gap-2" title="View resume preview below">
                      <ExternalLink className="w-4 h-4" />
                      {decodeURIComponent(props.resumeUrl).replace(/^[0-9]+-/, "")}
                    </a>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    <a
                      href={`/api/resume-download/${encodeURIComponent(props.resumeUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No resume uploaded</p>
              )}
            </div>

            {/* Website */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Website</h3>
              {props.website ? (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <a
                    href={`https://${props.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    {props.website}
                  </a>
                </Button>
              ) : (
                <p className="text-sm text-gray-400">No website provided</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileCard
