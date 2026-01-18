import { useState, useEffect, useCallback } from 'react';
import { getHealthMetrics, saveHealthMetric } from '../utils/healthStorage';

export default function SupplementCard({ user }) {
    const [supplements, setSupplements] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [entries, setEntries] = useState([{ name: '', amount: '' }]);

    const loadSupplements = useCallback(() => {
        const data = getHealthMetrics('supplements');
        setSupplements(data);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadSupplements();
    }, [user, loadSupplements]);

    const handleAddEntry = () => {
        setEntries([...entries, { name: '', amount: '' }]);
    };

    const handleRemoveEntry = (index) => {
        if (entries.length <= 1) return;
        setEntries(entries.filter((_, i) => i !== index));
    };

    const handleEntryChange = (index, field, value) => {
        const newEntries = [...entries];
        newEntries[index][field] = value;
        setEntries(newEntries);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Filter out empty entries
        const validEntries = entries.filter(e => e.name.trim() && e.amount);
        if (validEntries.length === 0) return;

        const entry = {
            date: selectedDate,
            value: validEntries, // Array of {name, amount}
            unit: 'g',
            createdAt: new Date().toISOString()
        };

        const updatedSupplements = saveHealthMetric('supplements', entry, user?.uid);
        setSupplements(updatedSupplements);
        setEntries([{ name: '', amount: '' }]);
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    const todaySupplements = supplements.find(s => s.date === new Date().toISOString().split('T')[0]);

    return (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>💊 Supplements</h3>
            </div>

            {/* Today's Supplements */}
            {todaySupplements && (
                <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Today's Intake</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {todaySupplements.value.map((supp, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600' }}>{supp.name}</span>
                                <span style={{ color: 'var(--primary-color)' }}>{supp.amount}g</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent History */}
            {supplements.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Recent Logs</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                        {supplements.slice(0, 5).map((log, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.02)',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.85rem'
                            }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                    {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {log.value.map((supp, j) => (
                                        <span key={j} style={{
                                            background: 'rgba(59, 130, 246, 0.2)',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem'
                                        }}>
                                            {supp.name} ({supp.amount}g)
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Date
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Supplements
                    </label>
                    {entries.map((entry, index) => (
                        <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="text"
                                placeholder="e.g., Protein"
                                value={entry.name}
                                onChange={(e) => handleEntryChange(index, 'name', e.target.value)}
                                style={{ flex: 2, padding: '0.5rem' }}
                            />
                            <input
                                type="number"
                                placeholder="Amount (g)"
                                value={entry.amount}
                                onChange={(e) => handleEntryChange(index, 'amount', e.target.value)}
                                min="0"
                                step="0.1"
                                style={{ flex: 1, padding: '0.5rem' }}
                            />
                            {entries.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveEntry(index)}
                                    style={{
                                        background: 'transparent',
                                        color: '#ef4444',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        padding: '0.25rem'
                                    }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddEntry}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.4rem',
                            fontSize: '0.85rem',
                            background: 'var(--surface-color)',
                            border: '1px dashed var(--primary-color)',
                            width: '100%',
                            color: 'var(--primary-color)',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        + Add Supplement
                    </button>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '0.5rem 1.5rem', width: '100%' }}
                >
                    Log Supplements
                </button>
            </form>
        </div>
    );
}
