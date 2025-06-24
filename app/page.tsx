"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, ExternalLink, Plus, Code2, Globe } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Link {
  id: string
  title: string
  url: string
  createdAt: Date
}

export default function Component() {
  const [links, setLinks] = useState<Link[]>([])

  // Load links from localStorage on component mount
  useEffect(() => {
    const savedLinks = localStorage.getItem("vibecoded-links")
    if (savedLinks) {
      try {
        const parsedLinks = JSON.parse(savedLinks).map((link: any) => ({
          ...link,
          createdAt: new Date(link.createdAt),
        }))
        setLinks(parsedLinks)
      } catch (error) {
        console.error("Error loading links from localStorage:", error)
        // If there's an error, set default links
        setLinks([
          {
            id: "1",
            title: "Portfolio Website",
            url: "https://example.com/portfolio",
            createdAt: new Date(),
          },
          {
            id: "2",
            title: "React Dashboard Project",
            url: "https://example.com/dashboard",
            createdAt: new Date(),
          },
        ])
      }
    } else {
      // Set default links if no saved data
      setLinks([
        {
          id: "1",
          title: "Portfolio Website",
          url: "https://example.com/portfolio",
          createdAt: new Date(),
        },
        {
          id: "2",
          title: "React Dashboard Project",
          url: "https://example.com/dashboard",
          createdAt: new Date(),
        },
      ])
    }
  }, [])

  // Save links to localStorage whenever links change
  useEffect(() => {
    localStorage.setItem("vibecoded-links", JSON.stringify(links))
  }, [links])

  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addLink = () => {
    if (newTitle.trim() && newUrl.trim()) {
      // Add https:// if no protocol is specified
      let formattedUrl = newUrl.trim()
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = "https://" + formattedUrl
      }

      const newLink: Link = {
        id: Date.now().toString(),
        title: newTitle.trim(),
        url: formattedUrl,
        createdAt: new Date(),
      }
      setLinks([newLink, ...links])
      setNewTitle("")
      setNewUrl("")
      setIsDialogOpen(false)
    }
  }

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Code2 className="h-10 w-10 text-emerald-400" />
              <div className="absolute -inset-1 bg-emerald-400/20 rounded-lg blur-sm"></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              vibecoded
            </h1>
          </div>
        </div>

        {/* Add Link Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 h-12 rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300">
              <Plus className="h-5 w-5 mr-2" />
              Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Project Link</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new link to your vibecoded projects collection.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300 font-medium">
                  Project Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., My React Dashboard"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTitle.trim() && newUrl.trim()) {
                      addLink()
                    }
                  }}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className="text-gray-300 font-medium">
                  Project URL
                </Label>
                <Input
                  id="url"
                  placeholder="e.g., github.com/username/project"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTitle.trim() && newUrl.trim()) {
                      addLink()
                    }
                  }}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg h-11"
                />
              </div>
              <Button
                onClick={addLink}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-11 rounded-lg font-semibold"
                disabled={!newTitle.trim() || !newUrl.trim()}
              >
                Add Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Links List */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-700 bg-gray-900/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="relative mb-6">
                  <Globe className="h-16 w-16 text-gray-600" />
                  <div className="absolute -inset-2 bg-gray-600/10 rounded-full blur-xl"></div>
                </div>
                <p className="text-gray-400 text-center max-w-xs leading-relaxed">
                  No project links yet. Add your first vibecoded project above!
                </p>
              </CardContent>
            </Card>
          ) : (
            links.map((link, index) => (
              <Card
                key={link.id}
                className="group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-emerald-500/50 hover:bg-gray-900/90 rounded-xl overflow-hidden"
                onClick={() => handleLinkClick(link.url)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all duration-300 border border-emerald-500/20">
                        <ExternalLink className="h-6 w-6 text-emerald-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors duration-300 text-lg">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate mt-1 group-hover:text-gray-300 transition-colors duration-300">
                        {link.url.replace(/^https?:\/\//, "")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 hover:bg-red-500/20 hover:text-red-400 text-gray-500 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeLink(link.id)
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
