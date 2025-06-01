"use client"

import { useState } from "react"
import { Plus, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddNoteButtonProps {
  onAddNote: (content: string, color: string) => void
}

const noteColors = [
  "#FFE4E1", // Light pink
  "#E1F5FE", // Light blue
  "#F3E5F5", // Light purple
  "#E8F5E8", // Light green
  "#FFF3E0", // Light orange
  "#F1F8E9", // Light lime
]

export default function AddNoteButton({ onAddNote }: AddNoteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState("")
  const [selectedColor, setSelectedColor] = useState(noteColors[0])

  const handleSubmit = () => {
    if (content.trim()) {
      onAddNote(content, selectedColor)
      setContent("")
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 shadow-lg z-50 group"
      >
        <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
      </Button>
    )
  }

  return (
    <div className="fixed top-6 right-6 w-80 bg-white rounded-2xl shadow-xl border border-pink-100 p-6 z-50 animate-in slide-in-from-top-2">
      <h3 className="font-semibold text-gray-800 mb-4">Add a sweet note 💕</h3>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something lovely..."
        className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
        autoFocus
      />

      <div className="flex gap-2 my-4">
        {noteColors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color ? "border-gray-400 scale-110" : "border-gray-200"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="flex-1 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600"
        >
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  )
}
