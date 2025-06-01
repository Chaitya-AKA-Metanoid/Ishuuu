# Love Notes - Interactive Sticky Notes with Music

A beautiful, interactive web application for sharing sticky notes and music with someone special. Built with Next.js, Tailwind CSS, and Firebase.

![Love Notes App](https://placeholder.svg?height=400&width=800)

## ✨ Features

- **Interactive Sticky Notes**: Create, drag, and customize colorful sticky notes
- **Music Player**: Built-in music player with controls (can be integrated with Spotify)
- **Real-time Updates**: Notes and reactions update in real-time
- **User Switching**: Easily switch between users to test both perspectives
- **Cute Animations**: Floating hearts and smooth interactions
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 14.x or later
- A Firebase project (for database functionality)

### Installation

1. Clone this repository:
   \`\`\`bash
   git clone https://github.com/yourusername/love-notes.git
   cd love-notes
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file in the root directory with your Firebase configuration:
   \`\`\`
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database
3. Set up Firestore security rules (example in `firestore.rules`)
4. Copy your Firebase config values to the `.env.local` file

## 📱 Deployment

### Deploy to Vercel

The easiest way to deploy this app is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/love-notes)

Remember to add your Firebase environment variables in the Vercel project settings.

### Deploy to GitHub Pages

To deploy to GitHub Pages:

1. Update `next.config.js` for static export
2. Build and export the project
3. Push the `out` directory to the `gh-pages` branch

## 🎨 Customization

- Change colors in the `noteColors` array in `add-note-button.tsx`
- Modify user profiles in `page.tsx`
- Add your own music tracks in `music-player.tsx`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
