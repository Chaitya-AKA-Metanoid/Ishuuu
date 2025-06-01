"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Heart, X } from "lucide-react"
import type { StickyNote as StickyNoteType } from "@/types/note"
import { Button } from "@/components/ui/button"

interface StickyNoteProps {
  note: StickyNoteType
  onDelete: (id: string) => void
  onReact: (noteId: string, emoji: string) => void
  onMove: (id: string, x: number, y: number) => void
  currentUser: string
}

const reactionEmojis = ["❤️", "😍", "🥰", "😘", "💕", "✨", "🌟", "💖"]

export default function StickyNote({ note, onDelete, onReact, onMove, currentUser }: StickyNoteProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; startMouseX: number; startMouseY: number }>()

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragRef.current = {
      startX: note.x,
      startY: note.y,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragRef.current) return

    const deltaX = e.clientX - dragRef.current.startMouseX
    const deltaY = e.clientY - dragRef.current.startMouseY

    onMove(note.id, dragRef.current.startX + deltaX, dragRef.current.startY + deltaY)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const getReactionCount = (emoji: string) => {
    return note.reactions.filter((r) => r.emoji === emoji).length
  }

  const hasUserReacted = (emoji: string) => {
    return note.reactions.some((r) => r.emoji === emoji && r.author === currentUser)
  }

  return (
    <div
      className={`absolute select-none transition-all duration-300 ${
        isDragging ? "scale-105 rotate-2 z-50" : isHovered ? "scale-102 z-40" : "z-30"
      }`}
      style={{
        left: note.x,
        top: note.y,
        transform: `rotate(${Math.random() * 6 - 3}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-64 h-64 p-4 rounded-lg shadow-lg cursor-move transition-all duration-300 ${
          note.color
        } ${isDragging ? "shadow-2xl" : "shadow-lg hover:shadow-xl"}`}
        style={{
          background: `linear-gradient(135deg, ${note.color} 0%, ${note.color}dd 100%)`,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <span className="text-xs font-medium text-white/80">{note.author}</span>
          </div>
          {note.author === currentUser && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(note.id)
              }}
              className="w-6 h-6 p-0 text-white/60 hover:text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="text-white/90 text-sm leading-relaxed mb-4 h-32 overflow-y-auto">{note.content}</div>

        {/* Reactions */}
        <div className="flex flex-wrap gap-1 mb-2">
          {reactionEmojis.map((emoji) => {
            const count = getReactionCount(emoji)
            const hasReacted = hasUserReacted(emoji)
            if (count === 0) return null

            return (
              <span
                key={emoji}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                  hasReacted ? "bg-white/30 text-white" : "bg-white/20 text-white/80 hover:bg-white/30"
                }`}
              >
                {emoji} {count}
              </span>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setShowReactions(!showReactions)
            }}
            className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2"
          >
            <Heart className="w-4 h-4" />
          </Button>

          <span className="text-xs text-white/60">
            {new Date(note.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Reaction Picker */}
        {showReactions && (
          <div className="absolute bottom-16 left-4 bg-white rounded-lg shadow-xl p-2 flex gap-1 z-50 animate-in slide-in-from-bottom-2">
            {reactionEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation()
                  onReact(note.id, emoji)
                  setShowReactions(false)
                }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
