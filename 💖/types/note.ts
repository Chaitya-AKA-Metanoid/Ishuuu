export interface StickyNote {
  id: string
  content: string
  author: string
  color: string
  x: number
  y: number
  timestamp: number
  reactions: Reaction[]
  isToday: boolean
}

export interface Reaction {
  id: string
  emoji: string
  author: string
  timestamp: number
}

export interface User {
  id: string
  name: string
  avatar: string
}
