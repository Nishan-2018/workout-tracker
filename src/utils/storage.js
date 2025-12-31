import { db } from './firebase'; // Ensure this path is correct
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LOCAL_SESSIONS_KEY = 'gym_tracker_sessions';
const LOCAL_TEMPLATES_KEY = 'gym_tracker_templates';

// --- Helper for Syncing ---
// --- Helper for Syncing ---
export const fetchUserData = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const cloudSessions = data.sessions || [];
      const cloudTemplates = data.templates || [];

      // Merge strategy: Cloud is source of truth, but we keep local-only items (unsynced work)
      const localSessions = getSessions();
      const localTemplates = getTemplates();

      const cloudSessionIds = new Set(cloudSessions.map(s => s.id));
      const cloudTemplateIds = new Set(cloudTemplates.map(t => t.id));

      const mergedSessions = [...cloudSessions];
      localSessions.forEach(s => {
        if (!cloudSessionIds.has(s.id)) {
          mergedSessions.push(s);
        }
      });

      const mergedTemplates = [...cloudTemplates];
      localTemplates.forEach(t => {
        if (!cloudTemplateIds.has(t.id)) {
          mergedTemplates.push(t);
        }
      });

      // Update Local Storage with merged data
      localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(mergedSessions));
      localStorage.setItem(LOCAL_TEMPLATES_KEY, JSON.stringify(mergedTemplates));

      // If we found local items that weren't in cloud, sync back to cloud
      if (mergedSessions.length > cloudSessions.length || mergedTemplates.length > cloudTemplates.length) {
        saveUserData(userId, mergedSessions, mergedTemplates);
      }

      return { sessions: mergedSessions, templates: mergedTemplates };
    }
  } catch (e) {
    console.error("Error fetching cloud data", e);
  }
  return null;
};

export const saveUserData = async (userId, sessions, templates) => {
  try {
    await setDoc(doc(db, "users", userId), {
      sessions,
      templates,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.error("Error saving to cloud", e);
  }
};

// --- Sessions ---
export const getSessions = () => {
  try {
    const data = localStorage.getItem(LOCAL_SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading sessions", error);
    return [];
  }
};

export const saveSession = (session, userId = null) => {
  try {
    const sessions = getSessions();
    const index = sessions.findIndex(s => s.id === session.id);

    let newSessions;
    if (index >= 0) {
      newSessions = [...sessions];
      newSessions[index] = session;
    } else {
      newSessions = [session, ...sessions];
    }

    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(newSessions));

    // Sync if user is logged in
    if (userId) {
      const templates = getTemplates();
      saveUserData(userId, newSessions, templates);
    }

    return newSessions;
  } catch (error) {
    console.error("Error saving session", error);
    return [];
  }
};

export const deleteSession = (id, userId = null) => {
  try {
    const sessions = getSessions();
    const newSessions = sessions.filter(s => s.id !== id);
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(newSessions));

    if (userId) {
      const templates = getTemplates();
      saveUserData(userId, newSessions, templates);
    }

    return newSessions;
  } catch (error) {
    console.error("Error deleting session", error);
    return [];
  }
};

export const createSession = (name, templateExercises = []) => {
  const exercises = templateExercises.map(name => ({
    id: crypto.randomUUID(),
    name: name,
    sets: [{ reps: '', weight: '' }, { reps: '', weight: '' }, { reps: '', weight: '' }],
    isCompleted: false
  }));

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    name: name,
    exercises: exercises
  };
};

// --- Templates ---
export const getTemplates = () => {
  try {
    const data = localStorage.getItem(LOCAL_TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading templates", error);
    return [];
  }
};

export const saveTemplate = (name, exerciseNames, userId = null) => {
  try {
    const templates = getTemplates();
    const newTemplate = { id: crypto.randomUUID(), name, exercises: exerciseNames };
    // Remove duplicate names if any
    const filtered = templates.filter(t => t.name !== name);
    const newTemplates = [newTemplate, ...filtered];

    localStorage.setItem(LOCAL_TEMPLATES_KEY, JSON.stringify(newTemplates));

    if (userId) {
      const sessions = getSessions();
      saveUserData(userId, sessions, newTemplates);
    }

    return newTemplates;
  } catch (error) {
    console.error("Error saving template", error);
    return [];
  }
};

export const deleteTemplate = (id, userId = null) => {
  const templates = getTemplates();
  const newTemplates = templates.filter(t => t.id !== id);
  localStorage.setItem(LOCAL_TEMPLATES_KEY, JSON.stringify(newTemplates));

  if (userId) {
    const sessions = getSessions();
    saveUserData(userId, sessions, newTemplates);
  }

  return newTemplates;
};

// --- Workout Streak Functions ---
export const getWorkoutStreak = () => {
  const sessions = getSessions();

  if (sessions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalWorkouts: 0
    };
  }

  // Get unique workout dates (one workout per day counts)
  const uniqueDates = [...new Set(sessions.map(s => new Date(s.date).toISOString().split('T')[0]))]
    .sort((a, b) => new Date(b) - new Date(a)); // Sort newest first

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if there's a workout today or yesterday to start the streak
  const latestWorkout = new Date(uniqueDates[0]);
  latestWorkout.setHours(0, 0, 0, 0);

  if (latestWorkout.getTime() === today.getTime() || latestWorkout.getTime() === yesterday.getTime()) {
    currentStreak = 1;
    let checkDate = new Date(latestWorkout);

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i]);
      prevDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(checkDate);
      expectedDate.setDate(expectedDate.getDate() - 1);

      if (prevDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
        checkDate = prevDate;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const nextDate = new Date(uniqueDates[i + 1]);

    const diffTime = currentDate - nextDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    totalWorkouts: sessions.length
  };
};

const getIntensityLevel = (count) => {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 2) return 2;
  if (count <= 3) return 3;
  return 4;
};

export const getWorkoutHeatmapData = (days = 365) => {
  const sessions = getSessions();
  const heatmapData = [];

  // Create a map of date -> workout count
  const workoutCountByDate = {};
  sessions.forEach(s => {
    const dateStr = new Date(s.date).toISOString().split('T')[0];
    workoutCountByDate[dateStr] = (workoutCountByDate[dateStr] || 0) + 1;
  });

  // Generate array of last N days with workout counts
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const count = workoutCountByDate[dateStr] || 0;

    heatmapData.push({
      date: dateStr,
      count: count,
      level: getIntensityLevel(count),
      day: d.getDay(), // 0 = Sunday, 6 = Saturday
      workouts: sessions.filter(s => new Date(s.date).toISOString().split('T')[0] === dateStr)
    });
  }

  return heatmapData;
};
