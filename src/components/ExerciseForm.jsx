import { useState, useEffect } from 'react';
import { getExercisePRs } from '../utils/storage';

export default function ExerciseForm({ onAddExercise, initialExercise = null, onCancel }) {
    const [name, setName] = useState('');
    const [numSets, setNumSets] = useState(3);
    const [sets, setSets] = useState(Array(3).fill({ reps: '', weight: '' }));
    const [prs, setPrs] = useState(Array(3).fill({ reps: '', weight: '' }));

    useEffect(() => {
        if (initialExercise) {
            setName(initialExercise.name);
            if (initialExercise.sets && initialExercise.sets.length > 0) {
                setSets(initialExercise.sets);
                setNumSets(initialExercise.sets.length);
            }
        } else {
            // Check for draft if not editing a specific exercise
            const draft = localStorage.getItem('exercise_form_draft');
            if (draft) {
                try {
                    const { name: draftName, sets: draftSets } = JSON.parse(draft);
                    setName(draftName || '');
                    if (draftSets && draftSets.length > 0) {
                        setSets(draftSets);
                        setNumSets(draftSets.length);
                    }
                } catch (e) { console.error("Error loading draft", e); }
            }
        }
    }, [initialExercise]);

    // Save draft whenever name or sets change
    useEffect(() => {
        if (!initialExercise) {
            localStorage.setItem('exercise_form_draft', JSON.stringify({ name, sets }));
        }
    }, [name, sets, initialExercise]);

    useEffect(() => {
        // Adjust PRs array size when numSets changes or name changes
        if (name) {
            const historicalBest = getExercisePRs(name);
            // Ensure prs array matches numSets length
            const newPrs = Array(numSets).fill({ reps: '', weight: '' }).map((_, i) => historicalBest[i] || { reps: '', weight: '' });
            setPrs(newPrs);
        } else {
            setPrs(Array(numSets).fill({ reps: '', weight: '' }));
        }
    }, [name, numSets]);

    const handleSetCountChange = (e) => {
        const count = parseInt(e.target.value) || 1;
        // Limit reasonable set count
        const validCount = Math.max(1, Math.min(20, count));

        setNumSets(validCount);

        // Resize sets array preserving existing data
        if (validCount > sets.length) {
            const added = Array(validCount - sets.length).fill({ reps: '', weight: '' });
            setSets([...sets, ...added]);
        } else if (validCount < sets.length) {
            setSets(sets.slice(0, validCount));
        }
    };

    const handleSetChange = (index, field, value) => {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return;

        onAddExercise({
            ...initialExercise, // Keep ID if editing a planned one
            id: initialExercise?.id || crypto.randomUUID(),
            name,
            sets,
            isCompleted: true
        });

        // Reset only if not editing a specific planned one (because that closes the form usually)
        if (!initialExercise) {
            localStorage.removeItem('exercise_form_draft');
            setName('');
            setNumSets(3);
            setSets(Array(3).fill({ reps: '', weight: '' }));
        }
    };

    return (
        <div className="glass-panel fade-in" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--primary-color)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                {initialExercise ? 'Log Planned Exercise' : 'Add New Exercise'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Exercise Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Incline Bench Press"
                            required
                            style={{ width: '100%' }}
                            autoFocus
                        />
                    </div>
                    <div style={{ width: '100px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Sets</label>
                        <input
                            type="number"
                            value={numSets}
                            onChange={handleSetCountChange}
                            min="1"
                            max="20"
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {sets.map((set, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', width: '50px', fontWeight: '600' }}>Set {i + 1}</span>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="number"
                                    placeholder={prs[i]?.reps ? `Best: ${prs[i].reps}` : "Reps"}
                                    value={set.reps}
                                    onChange={(e) => handleSetChange(i, 'reps', e.target.value)}
                                    style={{ padding: '0.5rem' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="number"
                                    placeholder={prs[i]?.weight ? `Best: ${prs[i].weight}` : "Weight (kg)"}
                                    value={set.weight}
                                    onChange={(e) => handleSetChange(i, 'weight', e.target.value)}
                                    style={{ padding: '0.5rem' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                        Save Log
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0 1rem' }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
