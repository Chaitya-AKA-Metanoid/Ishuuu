"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Track {
  id: string
  title: string
  artist: string
  duration: number
  url: string
}

const sampleTracks: Track[] = [
  { id: "1", title: "Perfect", artist: "Ed Sheeran", duration: 263, url: "/placeholder-audio.mp3" },
  { id: "2", title: "All of Me", artist: "John Legend", duration: 269, url: "/placeholder-audio.mp3" },
  { id: "3", title: "Thinking Out Loud", artist: "Ed Sheeran", duration: 281, url: "/placeholder-audio.mp3" },
]

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isLiked, setIsLiked] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const track = sampleTracks[currentTrack]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    audio.addEventListener("timeupdate", updateTime)
    return () => audio.removeEventListener("timeupdate", updateTime)
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % sampleTracks.length)
    setCurrentTime(0)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + sampleTracks.length) % sampleTracks.length)
    setCurrentTime(0)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 p-4 z-50">
      <audio ref={audioRef} src={track.url} volume={volume} />

      <div className="flex items-center gap-4">
        {/* Album Art */}
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
          <Heart className="w-8 h-8 text-white" />
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{track.title}</h3>
          <p className="text-sm text-gray-600 truncate">{track.artist}</p>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-300"
                style={{ width: `${(currentTime / track.duration) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={prevTrack} className="rounded-full hover:bg-pink-50">
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 shadow-lg"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          <Button variant="ghost" size="sm" onClick={nextTrack} className="rounded-full hover:bg-pink-50">
            <SkipForward className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className={`rounded-full ${isLiked ? "text-red-500 hover:bg-red-50" : "hover:bg-pink-50"}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-gray-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
            className="w-20 accent-pink-400"
          />
        </div>
      </div>
    </div>
  )
}
