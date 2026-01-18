# System Design Flow - IronTrack

This document details the architectural flows for the IronTrack application, focusing on Data Synchronization, User Interaction, and Logic Control.

## 1. High-Level Architecture
IronTrack operates on a **Local-First, Cloud-Assist** architecture. The application is fully functional offline, using the browser's LocalStorage as the primary data source. When online, it synchronizes with Firebase Firestore.

```mermaid
graph TD
    Client[Client Device]
    subgraph "Browser Layer"
        UI[React UI]
        State[React State]
        LS[(LocalStorage)]
        Auth[Firebase Auth SDK]
    end
    
    subgraph "Cloud Layer"
        FS[(Firestore DB)]
        FA[Firebase Auth]
    end

    UI <-->|Reads/Writes| State
    State <-->|Persist/Hydrate| LS
    
    Auth <-->|Tokens| FA
    
    LS <-->|Sync Engine| FS
```

---

## 2. Authentication & Initialization Flow
This flow ensures the user is recognized and their data is loaded without blocking the UI.

```mermaid
sequenceDiagram
    participant User
    participant App
    participant LocalStorage
    participant FirebaseAuth
    participant Firestore

    User->>App: Opens App
    App->>LocalStorage: Load cached Sessions/Templates
    LocalStorage-->>App: Return JSON Data
    App-->>User: Show UI (Immediate Render)

    App->>FirebaseAuth: Check Login State (Persistence)
    FirebaseAuth-->>App: Returns User Object (if logged in)

    alt Is Logged In
        App->>Firestore: Fetch User Data (Sessions/Templates)
        Firestore-->>App: Return Cloud Data
        App->>App: MERGE Strategy (Cloud + Local)
        App->>LocalStorage: Update Cache with Merged Data
        App-->>User: Update UI with Synced Data
        
        alt Local had new data
             App->>Firestore: Write merged back to Cloud
        end
    else Is Guest
        App->>App: Continue with Local Data only
    end
```

---

## 3. Workout Session Data Flow
How data moves when a user logs a workout.

```mermaid
flowchart LR
    User[User Action] -->|Input| Form[Exercise Form]
    Form -->|Submit| State[Update React State]
    State -->|Effect| LS[Save to LocalStorage]
    
    LS -->|Trigger| Sync{Sync Handler}
    
    Sync -->|Online| Cloud[Save to Firestore]
    Sync -->|Offline| Queue[Skip - Wait for next load]
```

**Conflict Resolution Strategy:**
*   **Create**: Random UUIDs generate unique IDs for every session/exercise, preventing ID collisions.
*   **Update**: "Last Write Wins" for individual fields, but the Merge Logic in `storage.js` prioritizes Union of data sets (keeping items that exist in one but not the other).

---

## 4. Deployment Pipeline (CI/CD)
How code gets from your machine to the live URL.

```mermaid
flowchart LR
    Dev[Developer] -->|Git Push| GitHub[GitHub Repository]
    
    subgraph "GitHub Actions"
        Build["Build Step: npm run build"]
        Test["Lint & Validation"]
    end
    
    GitHub --> Build
    Build --> Test
    
    Test -->|Success| Deploy[Firebase Deploy]
    Deploy -->|Hosting| Live[Live URL]
```
