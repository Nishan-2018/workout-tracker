import { useState, useEffect } from 'react';
import Header from './components/Header';
import ExerciseForm from './components/ExerciseForm';
import SessionHistory from './components/SessionHistory';
import WorkoutCategories from './components/WorkoutCategories';
import HealthTracking from './components/HealthTracking';
import WorkoutStreak from './components/WorkoutStreak';
import {
  getSessions, saveSession, createSession, deleteSession,
  getTemplates, saveTemplate, deleteTemplate,
  fetchUserData
} from './utils/storage';
import { auth, signInWithGoogle, logout } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [newSessionName, setNewSessionName] = useState('');

  // Templates State
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Editing State
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch cloud data
        await fetchUserData(currentUser.uid);
      }
      // Always load data (local will be updated by fetchUserData if logged in)
      loadData();
    });
    return () => unsubscribe();
  }, []);

  const loadData = () => {
    const loadedSessions = getSessions();
    setSessions(loadedSessions);
    setTemplates(getTemplates());

    const today = new Date().toDateString();
    const todaySession = loadedSessions.find(s => new Date(s.date).toDateString() === today);
    if (todaySession) setCurrentSession(todaySession);
  };

  const startSession = (e) => {
    e.preventDefault();
    if (!newSessionName) return;

    let templateExercises = [];
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) templateExercises = template.exercises;
    }

    const session = createSession(newSessionName, templateExercises);
    const updatedSessions = saveSession(session, user?.uid);
    setSessions(updatedSessions);
    setCurrentSession(session);
    setNewSessionName('');
    setSelectedTemplate('');
  };

  const handleSaveTemplate = () => {
    if (!currentSession) return;
    const names = currentSession.exercises.map(e => e.name);
    const uniqueNames = [...new Set(names)];
    if (uniqueNames.length === 0) return alert("Add some exercises first!");

    saveTemplate(currentSession.name, uniqueNames, user?.uid);
    setTemplates(getTemplates());
    alert(`Saved "${currentSession.name}" as a template!`);
  };

  const handleDeleteTemplate = (id) => {
    if (confirm("Delete this template?")) {
      setTemplates(deleteTemplate(id, user?.uid));
    }
  };

  const handleUpdateExercise = (exercise) => {
    if (!currentSession) return;

    let updatedExercises;
    const exists = currentSession.exercises.find(e => e.id === exercise.id);

    if (exists) {
      updatedExercises = currentSession.exercises.map(e =>
        e.id === exercise.id ? exercise : e
      );
    } else {
      updatedExercises = [exercise, ...currentSession.exercises];
    }

    const updatedSession = { ...currentSession, exercises: updatedExercises };
    const updatedSessions = saveSession(updatedSession, user?.uid);
    setSessions(updatedSessions);
    setCurrentSession(updatedSession);

    setEditingExerciseId(null);
    setShowAddForm(false);
  };

  const deleteExercise = (id) => {
    if (!confirm("Remove this exercise?")) return;
    const updatedSession = {
      ...currentSession,
      exercises: currentSession.exercises.filter(e => e.id !== id)
    };
    const updatedSessions = saveSession(updatedSession, user?.uid);
    setSessions(updatedSessions);
    setCurrentSession(updatedSession);
  };

  const handleDeleteSession = (id) => {
    if (confirm("Delete this workout session from history?")) {
      const updatedSessions = deleteSession(id, user?.uid);
      setSessions(updatedSessions);
      if (currentSession?.id === id) setCurrentSession(null);
    }
  };

  const handleEditSession = (session) => {
    setCurrentSession(session);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container" style={{ padding: '0 1rem 4rem 1rem' }}>

      {/* Auth Banner */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 0' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem' }}>{user.displayName || user.email}</span>
            <button onClick={logout} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'white' }}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={signInWithGoogle} className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <span>☁️ Sync Data (Login)</span>
          </button>
        )}
      </div>

      <Header />
      <WorkoutStreak sessions={sessions} />
      <main style={{ maxWidth: '800px', margin: '0 auto' }}>

        {!currentSession ? (
          <div className="glass-panel fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Start New Workout</h2>
            <form onSubmit={startSession} style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  1. Choose a Template
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => { setSelectedTemplate(''); setNewSessionName(''); }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      background: selectedTemplate === '' ? 'var(--primary-color)' : 'var(--surface-color)',
                      border: '1px solid var(--border-color)',
                      color: 'white'
                    }}
                  >
                    Empty
                  </button>
                  {templates.map(t => (
                    <div key={t.id} style={{ position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() => { setSelectedTemplate(t.id); setNewSessionName(t.name); }}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          background: selectedTemplate === t.id ? 'var(--primary-color)' : 'var(--surface-color)',
                          border: '1px solid var(--border-color)',
                          color: 'white',
                          paddingRight: '2.5rem'
                        }}
                      >
                        {t.name}
                      </button>
                      <span
                        onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(t.id); }}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}
                      >✕</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  2. Session Name
                </label>
                <input
                  value={newSessionName}
                  onChange={e => setNewSessionName(e.target.value)}
                  placeholder="e.g. Push Day"
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>
                Start Workout
              </button>
            </form>
          </div>
        ) : (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ color: 'var(--primary-color)' }}>{currentSession.name}</h2>
                <div style={{ color: 'var(--text-secondary)' }}>{new Date().toDateString()}</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleSaveTemplate}
                  style={{ background: 'var(--surface-hover)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}
                >
                  💾 Save Routine
                </button>
                <button
                  onClick={() => setCurrentSession(null)}
                  style={{ background: 'transparent', color: 'var(--text-secondary)', textDecoration: 'underline' }}
                >
                  Close
                </button>
              </div>
            </div>

            {!showAddForm && !editingExerciseId && (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
                style={{ width: '100%', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <span>+</span> Add New Exercise
              </button>
            )}

            {showAddForm && (
              <ExerciseForm
                onAddExercise={handleUpdateExercise}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
              {currentSession.exercises.map(ex => {
                if (editingExerciseId === ex.id) {
                  return (
                    <ExerciseForm
                      key={ex.id}
                      initialExercise={ex}
                      onAddExercise={handleUpdateExercise}
                      onCancel={() => setEditingExerciseId(null)}
                    />
                  )
                }

                return (
                  <div key={ex.id} className="glass-panel" style={{ padding: '1rem', borderLeft: ex.isCompleted ? '4px solid var(--secondary-color)' : '4px solid var(--text-secondary)', opacity: ex.isCompleted ? 1 : 0.8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{ex.name}</div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setEditingExerciseId(ex.id)}
                          style={{ background: 'var(--surface-color)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}
                        >
                          {ex.isCompleted ? 'Edit Sets' : 'Log Sets'}
                        </button>
                        <button
                          onClick={() => deleteExercise(ex.id)}
                          style={{ background: 'transparent', color: '#ef4444', padding: '0 0.5rem' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {ex.sets.map((s, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', minWidth: '60px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Set {i + 1}</span>
                          <span style={{ fontSize: '0.9rem', color: ex.isCompleted ? 'white' : 'var(--text-secondary)' }}>
                            {s.reps || '-'} <span style={{ fontSize: '0.7rem' }}>x</span> {s.weight || '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        <SessionHistory
          sessions={sessions.filter(s => s.id !== currentSession?.id)}
          onDeleteSession={handleDeleteSession}
          onEditSession={handleEditSession}
        />



        <HealthTracking user={user} />

        <WorkoutCategories />

      </main>
    </div>
  );
}

export default App;
