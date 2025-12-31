# Prompt to Recreate IronTrack from Scratch

Use this prompt with an AI coding assistant to recreate this entire application from the ground up.

---

## Initial Prompt

```
I want you to build a modern gym workout tracking web application called "IronTrack" with the following requirements:

### Core Features:
1. **Workout Sessions**: Users can create daily workout sessions with custom names (e.g., "Push Day", "Pull Day", "Leg Day")
2. **Exercise Logging**: For each session, users can add multiple exercises with 3 sets each (reps and weight in kg)
3. **Templates**: Users can save workout routines as templates and reuse them for future sessions
4. **History**: Display all past workout sessions with full details (date, exercises, sets, reps, weights)
5. **Offline-First**: The app must work completely offline using LocalStorage
6. **Cloud Sync**: When users log in with Google, sync data to Firebase Firestore for cross-device access
7. **PWA**: Make it installable as a Progressive Web App with service workers

### Technical Stack:
- **Frontend**: React 19+ with Vite as the build tool
- **Styling**: Vanilla CSS with CSS Variables for theming (dark mode with neon accents)
- **Authentication**: Firebase Auth with Google Sign-In
- **Database**: Firebase Firestore for cloud storage, LocalStorage for offline
- **Deployment**: Firebase Hosting with GitHub Actions for CI/CD

### Design Requirements:
- **Premium Dark Theme**: Deep navy/slate background (#0f172a) with cyan/blue accent colors
- **Glassmorphism**: Use frosted glass effects for cards and panels
- **Responsive**: Must work perfectly on mobile devices
- **Smooth Animations**: Fade-ins, hover effects, and micro-interactions
- **Modern Typography**: Clean, readable fonts

### Data Structure:
```javascript
Session {
  id: UUID,
  date: ISO timestamp,
  name: string,
  exercises: [
    {
      id: UUID,
      name: string,
      sets: [
        { reps: number, weight: number },
        { reps: number, weight: number },
        { reps: number, weight: number }
      ],
      isCompleted: boolean
    }
  ]
}

Template {
  id: UUID,
  name: string,
  exercises: [string] // Just exercise names
}
```

### Sync Strategy:
- **Local-First**: All reads/writes happen to LocalStorage immediately for zero latency
- **Merge on Login**: When user logs in, fetch cloud data and merge with local data (keep items that exist in one but not the other)
- **Auto-Sync**: When user is logged in, automatically push changes to Firestore after local writes
- **Conflict Resolution**: Use UUID-based identification to prevent duplicates; prefer union of data sets

### User Flow:
1. User opens app → Immediately sees UI with local data
2. User can start a new workout session (choose template or start empty)
3. User adds exercises and logs sets with reps/weights
4. User can edit existing exercises in the current session
5. User can save the current workout as a template for future use
6. User can view history of all past workouts
7. User can optionally log in with Google to sync across devices

### File Structure:
```
/src
  /components
    - Header.jsx
    - ExerciseForm.jsx
    - SessionHistory.jsx
  /utils
    - firebase.js (Firebase config and auth functions)
    - storage.js (LocalStorage + Firestore sync logic)
  - App.jsx (Main application logic)
  - main.jsx (Entry point)
  - index.css (Global styles with CSS variables)
/public
  - pwa-192x192.png
  - pwa-512x512.png
- vite.config.js (with vite-plugin-pwa configured)
- index.html
```

### Implementation Steps:
1. Set up Vite + React project
2. Install dependencies: `firebase`, `vite-plugin-pwa`
3. Create the CSS design system with variables
4. Build the Header component
5. Build the ExerciseForm component (for adding/editing exercises)
6. Build the SessionHistory component
7. Implement the storage.js utility with LocalStorage functions
8. Set up Firebase project and add config to firebase.js
9. Implement Firebase Auth with Google Sign-In
10. Implement Firestore sync logic with merge strategy
11. Build the main App.jsx with state management
12. Configure PWA in vite.config.js with manifest
13. Generate app icons (192x192 and 512x512)
14. Test offline functionality
15. Set up Firebase Hosting
16. Create GitHub Actions workflow for CI/CD

### Key Implementation Details:

**Auth Persistence:**
```javascript
import { setPersistence, browserLocalPersistence } from "firebase/auth";
setPersistence(auth, browserLocalPersistence);
```

**Merge Strategy in storage.js:**
```javascript
// When fetching cloud data, merge with local
const cloudSessionIds = new Set(cloudSessions.map(s => s.id));
const mergedSessions = [...cloudSessions];
localSessions.forEach(s => {
  if (!cloudSessionIds.has(s.id)) {
    mergedSessions.push(s);
  }
});
```

**PWA Configuration:**
```javascript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'IronTrack - Gym Workout Tracker',
    short_name: 'IronTrack',
    theme_color: '#0f172a',
    background_color: '#0f172a',
    display: 'standalone',
    icons: [...]
  }
})
```

### Expected Deliverables:
1. Fully functional web application
2. README.md with setup instructions
3. Technical documentation explaining architecture
4. System design document with Mermaid diagrams
5. GitHub repository with CI/CD configured
6. Live deployment on Firebase Hosting

Please build this step by step, explaining your decisions as you go.
```

---

## Follow-up Prompts (After Initial Build)

### For Bug Fixes:
```
I'm experiencing two issues:
1. When I edit an exercise, the form shows empty instead of pre-filling with existing values
2. When I refresh the browser, I have to log in again

Please fix these issues.
```

### For PWA Enhancement:
```
Convert this application to a Progressive Web App:
1. Add manifest.json with proper icons
2. Configure service workers for offline functionality
3. Make it installable on mobile devices
4. Generate appropriate app icons (192x192 and 512x512)
```

### For Documentation:
```
Create comprehensive documentation for this project including:
1. Technical documentation with tech stack rationale
2. System design with architecture diagrams (use Mermaid)
3. Advantages, disadvantages, and scaling strategies
4. Future improvement roadmap
```

---

## Tips for Best Results

1. **Be Specific**: The more details you provide about design preferences, the better the output
2. **Iterate**: Start with core features, then add enhancements
3. **Ask for Explanations**: Request the AI to explain architectural decisions
4. **Request Diagrams**: Ask for Mermaid diagrams to visualize flows
5. **Test Incrementally**: Build and test each component before moving to the next
6. **Document as You Go**: Ask for documentation updates with each major feature

---

## Alternative Shorter Prompt (If You Want More AI Creativity)

```
Build me a modern gym workout tracker web app with React + Vite + Firebase. 

Requirements:
- Track exercises with sets/reps/weights
- Save workout templates
- Offline-first with LocalStorage
- Google login with Firestore sync
- Dark theme with glassmorphism
- PWA installable
- CI/CD with GitHub Actions

Make it look premium and modern. Explain your architecture choices.
```

This shorter version gives the AI more creative freedom while still hitting the key requirements.
