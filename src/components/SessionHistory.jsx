export default function SessionHistory({ sessions, onDeleteSession, onEditSession }) {
    if (sessions.length === 0) return null;

    return (
        <div style={{ marginTop: '3rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {sessions.map(session => (
                    <div key={session.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div>
                                <h4 style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>{session.name}</h4>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => onEditSession(session)}
                                    style={{ background: 'var(--surface-color)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDeleteSession(session.id)}
                                    style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                                    title="Delete Session"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {session.exercises.map(ex => (
                                <div key={ex.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{ex.name}</div>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                                        {ex.sets.map((s, i) => (
                                            <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                                                S{i + 1}: <strong style={{ color: 'var(--text-primary)' }}>{s.reps || 0}</strong> x <strong style={{ color: 'var(--text-primary)' }}>{s.weight || 0}kg</strong>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {session.exercises.length === 0 && (
                                <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>No exercises logged.</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
