# IronTrack - Gym Workout Tracker

A modern, feature-rich workout tracking application built with React, Vite, and Firebase.

## ✨ Features

### 🏋️ Core Workout Tracking
- **Smart Templates**: Save your favorite routines and load them instantly.
- **Dynamic Logging**: Add/remove sets on the fly; edit past sessions.
- **Beginner Plans**: Pre-loaded workout categories with exercises.
- **Visual History**: Clean, dark-mode log of all your workouts.

### 📊 Advanced Analytics
- **Workout Streak**: GitHub-style heatmap and streak counters to keep you motivated.
- **Health Dashboard**: Track Body Weight, Sleep, Fatigue, Water, and Supplements.
- **Trend Detection**: automatic analysis (📈 Increasing / 📉 Decreasing / ➖ Stable).
- **Interactive Charts**: Visualize progress with 7d/30d/90d/All time ranges.

### 🔐 Technical Highlights
- **Cloud Sync**: Firebase integration for cross-device access.
- **Offline First**: Full functionality without internet (LocalStorage).
- **Responsive**: pixel-perfect design for mobile and desktop.

### 📚 Beginner Workout Categories
Pre-built workout routines organized by muscle groups:
- 💪 Chest Workout
- 🦵 Leg Exercise
- 💪 Biceps
- 🔥 Core Muscles
- 🤜 Forearms
- 🦒 Neck
- 🍑 Glutes
- 💪 Back Workout
- 🧘 Full Body Stretching

**50+ exercises** with detailed instructions and proper form guidance.

### 🔐 Authentication & Sync
- **Google Sign-In**: Secure authentication via Firebase
- **Cloud Sync**: Automatic data synchronization across devices
- **Offline Support**: Works seamlessly without internet connection
- **Data Persistence**: LocalStorage + Firebase Firestore integration

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nishan-2018/workout-tracker.git
   cd workout-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

## 🛠️ Development Workflow

### Code Quality

Before committing code, ensure it passes linting and builds successfully:

1. **Run ESLint**:
   ```bash
   npm run lint
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Preview production build**:
   ```bash
   npm run preview
   ```

### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/build.yml`) that automatically:
- ✅ Runs ESLint to check code quality
- ✅ Builds the application for production
- ✅ Validates all dependencies

The workflow runs on every push to the `ganesh-add-workoutStreakN-exgCardN-detailsTrack` branch.

## 📦 Tech Stack

- **Frontend**: React 19.2, Vite 7.2
- **Charts**: Recharts 3.6
- **Backend**: Firebase (Authentication, Firestore)
- **Styling**: Custom CSS with CSS Variables
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Build Tool**: Vite with PWA plugin
- **Code Quality**: ESLint 9.39

## 📁 Project Structure

```
src/
├── components/
│   ├── ExerciseForm.jsx          # Dynamic sets management
│   ├── SessionHistory.jsx        # Edit/delete workout sessions
│   ├── WorkoutCategories.jsx     # Beginner workout library
│   ├── WorkoutStreak.jsx         # GitHub-style heatmap
│   ├── HealthMetricCard.jsx      # Reusable metric card
│   ├── HealthTracking.jsx        # Health metrics dashboard
│   └── SupplementCard.jsx        # Supplement tracking
├── data/
│   └── categories.json           # Workout category data
├── utils/
│   ├── storage.js                # LocalStorage + Firebase sync
│   ├── healthStorage.js          # Health metrics storage
│   └── firebase.js               # Firebase configuration
└── App.jsx                       # Main application
```

## 🎯 Key Features in Detail

### Workout Templates
- **Save Routine**: Instantly save any current workout as a named template
- **Quick Load**: Start a new session from a template with one click
- **Management**: Delete old templates directly from the "Start New Workout" screen

### Dynamic Sets Management
- Add unlimited sets to any exercise
- Remove sets with a single click (minimum 1 set required)
- Sets persist across sessions

### Workout Streak Tracker
- **Algorithm**: Calculates consecutive workout days
- **Current Streak**: Counts from today/yesterday backwards
- **Longest Streak**: Tracks your best performance
- **Heatmap**: 365-day visualization with 5 intensity levels

### Health Tracking
- **Trend Detection**: Compares first 30% vs last 30% of data
- **Responsive Charts**: Built with Recharts for smooth interactions
- **Extensible Design**: Easy to add new metrics
- **Data Validation**: Min/max constraints for each metric type

## 🔒 Privacy & Data

- **Local-First**: All data stored in browser LocalStorage
- **Optional Cloud Sync**: Firebase integration for multi-device access
- **No Tracking**: Your workout data stays private
- **Offline Capable**: Full functionality without internet

## 🛡️ Security

This project takes security seriously. We have implemented:
- **Strict Access Control**: Firestore rules enforce ownership checks for all data.
- **Security Headers**: HSTS, CSP, and X-Frame-Options are configured for hosting.
- **Audit**: Regularly audited for vulnerabilities.

For full details, see [SECURITY.md](./docs/SECURITY.md).

## 📖 Documentation

- [Implementation Walkthrough](./docs/IMPLEMENTATION_WALKTHROUGH.md) - Detailed feature documentation
- [Health Tracking Plan](./docs/health_tracking_plan.md) - Health metrics implementation details
- [Workout Streak Plan](./docs/workout_streak_feature_plan.md) - Streak feature architecture
- [System Design](./docs/SYSTEM_DESIGN.md) - Overall system architecture
- [Technical Documentation](./docs/TECHNICAL_DOCUMENTATION.md) - Technical specifications
- [User Guide](./docs/USER_GUIDE.md) - User GUide

## 🧪 Testing

The application has been tested for:
- ✅ Dynamic set addition/removal
- ✅ Session edit and delete functionality
- ✅ Workout category navigation
- ✅ Health metric logging and visualization
- ✅ Streak calculation accuracy
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Firebase synchronization
- ✅ Offline functionality

## 🚀 Deployment

### Firebase Hosting (Recommended)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

### Azure Static Web Apps

1. Push code to GitHub
2. Create an Azure Static Web App in the Azure Portal
3. Connect your GitHub repository
4. Azure will automatically build and deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Firebase for authentication and database services
- Recharts for beautiful, responsive charts
- React team for the amazing framework
- Vite for lightning-fast build tooling

---

**Built with ❤️ for fitness enthusiasts**
