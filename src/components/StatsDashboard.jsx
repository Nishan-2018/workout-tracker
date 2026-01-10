import { useState, useMemo } from 'react';
import { calculateStats } from '../utils/analytics';

export default function StatsDashboard({ sessions }) {
    const [timeRange, setTimeRange] = useState('week'); // 'week' | 'month'

    const stats = useMemo(() => {
        return calculateStats(sessions, timeRange);
    }, [sessions, timeRange]);

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', background: 'linear-gradient(45deg, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Your Progress
                </h3>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    style={{
                        background: 'var(--surface-color)',
                        color: 'white',
                        border: '1px solid var(--border-color)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value="week">Past 7 Days</option>
                    <option value="month">Past 30 Days</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {/* Calorie Card */}
                <div style={{ background: 'rgba(255,100,100,0.1)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,100,100,0.2)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔥</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                        {stats.totalCalories}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Kcal Burned</div>
                </div>

                {/* Workouts Card */}
                <div style={{ background: 'rgba(100,100,255,0.1)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(100,100,255,0.2)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>💪</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#6b6bff' }}>
                        {stats.totalWorkouts}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Workouts Completed</div>
                </div>
            </div>

            {/* Muscle Distribution */}
            <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Muscle Focus
                </h4>

                {stats.muscleDistribution.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        No data yet. Go lift something! 🏋️‍♂️
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stats.muscleDistribution.map((item, index) => (
                            <div key={item.name}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                    <span>{item.name}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{item.count} sets ({item.percentage}%)</span>
                                </div>
                                <div style={{ height: '8px', background: 'var(--surface-color)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            width: `${item.percentage}%`,
                                            height: '100%',
                                            background: getColorForIndex(index),
                                            borderRadius: '4px',
                                            transition: 'width 0.5s ease-out'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function getColorForIndex(index) {
    const colors = [
        '#34d399', // Green
        '#60a5fa', // Blue
        '#f472b6', // Pink
        '#fbbf24', // Amber
        '#a78bfa', // Purple
        '#9ca3af'  // Gray
    ];
    return colors[index % colors.length];
}
