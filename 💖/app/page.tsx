"use client"

import { useState, useEffect } from "react"
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { StickyNote, User } from "@/types/note"
import StickyNoteComponent from "@/components/sticky-note"
import AddNoteButton from "@/components/add-note-button"
import MusicPlayer from "@/components/music-player"
import { Heart, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

const userProfiles = [
  { id: "user1", name: "You", avatar: "🤗", color: "from-pink-400 to-purple-500" },
  { id: "user2", name: "Your Love", avatar: "😍", color: "from-purple-400 to-blue-500" },
]

export default function Home() {
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showUserSelect, setShowUserSelect] = useState(true)
  const [firebaseError, setFirebaseError] = useState<string | null>(null)

  // Simple user selection without Firebase Auth
  const selectUser = (userIndex: number) => {
    const user = {
      ...userProfiles[userIndex],
      id: `user_${userIndex}_${Date.now()}`,
    }
    setCurrentUser(user)
    setShowUserSelect(false)
    localStorage.setItem("selectedUser", JSON.stringify(user))
  }

  useEffect(() => {
    // Check if user was previously selected
    const savedUser = localStorage.getItem("selectedUser")
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
        setShowUserSelect(false)
      } catch (error) {
        console.error("Error parsing saved user:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (!currentUser || showUserSelect) return

    try {
      // Listen to today's notes
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const notesQuery = query(
        collection(db, "notes"),
        where("timestamp", ">=", today.getTime()),
        orderBy("timestamp", "desc"),
      )

      const unsubscribe = onSnapshot(
        notesQuery,
        (snapshot) => {
          const notesData: StickyNote[] = []
          snapshot.forEach((doc) => {
            notesData.push({ id: doc.id, ...doc.data() } as StickyNote)
          })
          setNotes(notesData)
          setIsLoading(false)
          setFirebaseError(null)
        },
        (error) => {
          console.error("Error fetching notes:", error)
          setFirebaseError("Unable to connect to database. Please check your Firebase configuration.")
          setIsLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Error setting up Firebase listener:", error)
      setFirebaseError("Firebase configuration error. Please check your environment variables.")
      setIsLoading(false)
    }
  }, [currentUser, showUserSelect])

  const addNote = async (content: string, color: string) => {
    if (!currentUser) return

    const newNote = {
      content,
      author: currentUser.name,
      color,
      x: Math.random() * (window.innerWidth - 300),
      y: Math.random() * (window.innerHeight - 400) + 100,
      timestamp: Date.now(),
      reactions: [],
      isToday: true,
    }

    try {
      await addDoc(collection(db, "notes"), newNote)
    } catch (error) {
      console.error("Error adding note:", error)
      setFirebaseError("Unable to save note. Please check your connection.")
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, "notes", noteId))
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const moveNote = async (noteId: string, x: number, y: number) => {
    try {
      await updateDoc(doc(db, "notes", noteId), { x, y })
    } catch (error) {
      console.error("Error moving note:", error)
    }
  }

  const addReaction = async (noteId: string, emoji: string) => {
    if (!currentUser) return

    const reaction = {
      id: Date.now().toString(),
      emoji,
      author: currentUser.name,
      timestamp: Date.now(),
    }

    try {
      await updateDoc(doc(db, "notes", noteId), {
        reactions: arrayUnion(reaction),
      })
    } catch (error) {
      console.error("Error adding reaction:", error)
    }
  }

  const switchUser = () => {
    setShowUserSelect(true)
    setCurrentUser(null)
    localStorage.removeItem("selectedUser")
  }

  // User selection screen
  if (showUserSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Our Love Notes</h1>
            <p className="text-gray-600">Choose who you are to start sharing sweet messages</p>
          </div>

          <div className="space-y-4">
            {userProfiles.map((user, index) => (
              <Button
                key={user.id}
                onClick={() => selectUser(index)}
                className={`w-full h-16 bg-gradient-to-r ${user.color} hover:scale-105 transition-all duration-300 text-white font-medium rounded-xl shadow-lg`}
              >
                <span className="text-2xl mr-3">{user.avatar}</span>
                <span className="text-lg">{user.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (firebaseError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-red-400 mb-4">
            <Heart className="w-12 h-12 mx-auto mb-2" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{firebaseError}</p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-pink-400 to-purple-500">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your love notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-hidden relative">
      {/* Floating hearts animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            <Heart className="w-4 h-4 text-pink-200 opacity-60" />
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-pink-100 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Our Love Notes</h1>
              <p className="text-sm text-gray-600">Today's sweet messages</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Playing our playlist</span>
            </div>
            <Button variant="ghost" onClick={switchUser} className="flex items-center gap-2 hover:bg-pink-50">
              <span className="text-lg">{currentUser?.avatar}</span>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
                <p className="text-xs text-gray-600">Switch user</p>
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Notes */}
      <div className="pt-20 pb-32">
        {notes.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No notes yet today</h2>
              <p className="text-gray-500">Start by adding your first sweet message!</p>
            </div>
          </div>
        ) : (
          notes.map((note) => (
            <StickyNoteComponent
              key={note.id}
              note={note}
              onDelete={deleteNote}
              onReact={addReaction}
              onMove={moveNote}
              currentUser={currentUser?.name || ""}
            />
          ))
        )}
      </div>

      {/* Add Note Button */}
      <AddNoteButton onAddNote={addNote} />

      {/* Music Player */}
      <MusicPlayer />

      {/* Custom styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
