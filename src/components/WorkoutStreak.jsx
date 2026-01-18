import { useState, useEffect, useCallback } from 'react';
import { getWorkoutStreak, getWorkoutHeatmapData } from '../utils/storage';

export default function WorkoutStreak({ sessions }) {
    const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0, totalWorkouts: 0 });
    const [heatmapData, setHeatmapData] = useState([]);
    const [hoveredCell, setHoveredCell] = useState(null);
    const viewDays = 365;



    const loadStreakData = useCallback(() => {
        const streak = getWorkoutStreak();
        setStreakData(streak);

        const heatmap = getWorkoutHeatmapData(viewDays);
        setHeatmapData(heatmap);
    }, [viewDays]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadStreakData();
    }, [sessions, viewDays, loadStreakData]);

    const getColorForLevel = (level) => {
        const colors = [
            'rgba(255,255,255,0.05)',      // Level 0 - no workouts
            'rgba(59, 130, 246, 0.3)',     // Level 1 - 1 workout
            'rgba(59, 130, 246, 0.5)',     // Level 2 - 2 workouts
            'rgba(59, 130, 246, 0.7)',     // Level 3 - 3 workouts
            'rgba(59, 130, 246, 1.0)'      // Level 4 - 4+ workouts
        ];
        return colors[level] || colors[0];
    };

    // Group heatmap data by weeks
    const getWeeksData = () => {
        const weeks = [];
        let currentWeek = [];

        // Find the first Sunday to start the grid
        const firstDate = new Date(heatmapData[0]?.date);
        const firstDay = firstDate?.getDay() || 0;

        // Add empty cells for days before the first date
        for (let i = 0; i < firstDay; i++) {
            currentWeek.push(null);
        }

        heatmapData.forEach((day, index) => {
            currentWeek.push(day);

            // If it's Saturday or the last day, push the week
            if (day.day === 6 || index === heatmapData.length - 1) {
                // Fill remaining days of the week with null
                while (currentWeek.length < 7) {
                    currentWeek.push(null);
                }
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
        });

        return weeks;
    };

    const weeks = getWeeksData();
    const monthLabels = getMonthLabels();

    function getMonthLabels() {
        const labels = [];
        let lastMonth = -1;

        heatmapData.forEach((day, index) => {
            const date = new Date(day.date);
            const month = date.getMonth();

            if (month !== lastMonth && index % 7 === 0) {
                labels.push({
                    month: date.toLocaleDateString('en-US', { month: 'short' }),
                    position: Math.floor(index / 7)
                });
                lastMonth = month;
            }
        });

        return labels;
    }

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            {/* Header */}
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔥</span> Workout Streak
            </h3>

            {/* Stats */}
            <div style={{
                display: 'flex',
                gap: '2rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                justifyContent: 'space-around'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Current Streak</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {streakData.currentStreak}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>days</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Longest Streak</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                        {streakData.longestStreak}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>days</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Workouts</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                        {streakData.totalWorkouts}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>sessions</div>
                </div>
            </div>

            {/* Heatmap */}
            {heatmapData.length > 0 ? (
                <div style={{ position: 'relative' }}>
                    {/* Scrollable Container */}
                    <div style={{
                        overflowX: 'auto',
                        paddingBottom: '1rem',
                        WebkitOverflowScrolling: 'touch' // Smoother scrolling on iOS
                    }}>

                        {/* Wrapper to align labels and grid together */}
                        <div style={{ minWidth: 'fit-content', position: 'relative' }}>

                            {/* Month labels - Now inside the scrollable area */}

                            {/* Month labels */}
                            <div style={{
                                display: 'flex',
                                marginBottom: '1rem',
                                paddingLeft: '90px',
                                fontSize: '0.7rem',
                                color: 'var(--text-secondary)'
                            }}>
                                {monthLabels.map((label, i) => (
                                    <div key={i} style={{
                                        position: 'absolute',
                                        left: `${60 + label.position * 16}px`
                                    }}>
                                        {label.month}
                                    </div>
                                ))}
                            </div>

                            {/* Heatmap grid */}
                            {/*<div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '1rem' }}>*/}
                            <div style={{ display: 'flex', gap: '3px', paddingBottom: '1rem' }}>
                                {/* Day labels */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginRight: '5px' }}>
                                    <div style={{ height: '12px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Mon</div>
                                    <div style={{ height: '12px' }}></div>
                                    <div style={{ height: '12px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Wed</div>
                                    <div style={{ height: '12px' }}></div>
                                    <div style={{ height: '12px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Fri</div>
                                    <div style={{ height: '12px' }}></div>
                                    <div style={{ height: '12px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Sun</div>
                                </div>

                                {/* Weeks */}
                                {weeks.map((week, weekIndex) => (
                                    <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        {week.map((day, dayIndex) => (
                                            <div
                                                key={dayIndex}
                                                onMouseEnter={() => day && setHoveredCell(day)}
                                                onMouseLeave={() => setHoveredCell(null)}
                                                style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    borderRadius: '2px',
                                                    background: day ? getColorForLevel(day.level) : 'transparent',
                                                    cursor: day ? 'pointer' : 'default',
                                                    transition: 'transform 0.1s',
                                                    transform: hoveredCell?.date === day?.date ? 'scale(1.5)' : 'scale(1)',
                                                    border: day ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                                }}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* Tooltip */}
                    {hoveredCell && (
                        <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--surface-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            minWidth: '200px',
                            zIndex: 1000,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                                {new Date(hoveredCell.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                                {hoveredCell.count} {hoveredCell.count === 1 ? 'workout' : 'workouts'}
                            </div>
                            {hoveredCell.workouts.length > 0 && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {hoveredCell.workouts.map((w, i) => (
                                        <div key={i}>• {w.name}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Legend */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '1rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        justifyContent: 'center'
                    }}>
                        <span>Less</span>
                        {[0, 1, 2, 3, 4].map(level => (
                            <div
                                key={level}
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '2px',
                                    background: getColorForLevel(level),
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            />
                        ))}
                        <span>More</span>
                    </div>
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--text-secondary)',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏋️</div>
                    <div>No workouts yet. Start your streak today!</div>
                </div>
            )}
        </div>
    );
}
