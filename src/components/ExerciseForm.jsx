import { useState, useEffect } from 'react';

export default function ExerciseForm({ onAddExercise, initialExercise = null, onCancel }) {
    const [name, setName] = useState('');
    const [sets, setSets] = useState([
        { reps: '', weight: '' },
        { reps: '', weight: '' },
        { reps: '', weight: '' }
    ]);

    useEffect(() => {
        if (initialExercise) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName(initialExercise.name);
            if (initialExercise.sets && initialExercise.sets.length > 0) {
                setSets(initialExercise.sets);
            }
        }
    }, [initialExercise]);

    const handleSetChange = (index, field, value) => {
        const newSets = [...sets];
        newSets[index][field] = value;
        setSets(newSets);
    };

    const addSet = () => {
        setSets([...sets, { reps: '', weight: '' }]);
    };

    const removeSet = (index) => {
        if (sets.length <= 1) return;
        const newSets = sets.filter((_, i) => i !== index);
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
            setName('');
            setSets([
                { reps: '', weight: '' },
                { reps: '', weight: '' },
                { reps: '', weight: '' }
            ]);
        }
    };

    return (
        <div className="glass-panel fade-in" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--primary-color)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                {initialExercise ? 'Log Planned Exercise' : 'Add New Exercise'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
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

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {sets.map((set, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', width: '45px', fontWeight: '600', fontSize: '0.85rem' }}>Set {i + 1}</span>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="number"
                                    placeholder="Reps"
                                    value={set.reps}
                                    onChange={(e) => handleSetChange(i, 'reps', e.target.value)}
                                    style={{ padding: '0.5rem', width: '100%' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="number"
                                    placeholder="Weight (kg)"
                                    value={set.weight}
                                    onChange={(e) => handleSetChange(i, 'weight', e.target.value)}
                                    style={{ padding: '0.5rem', width: '100%' }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSet(i)}
                                style={{
                                    background: 'transparent',
                                    color: '#ef4444',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    fontSize: '1.2rem',
                                    display: sets.length > 1 ? 'block' : 'none'
                                }}
                                title="Remove Set"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSet}
                        className="btn-secondary"
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.4rem',
                            fontSize: '0.85rem',
                            background: 'var(--surface-color)',
                            border: '1px dashed var(--primary-color)',
                            width: '100%',
                            color: 'var(--primary-color)'
                        }}
                    >
                        + Add Set
                    </button>
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
