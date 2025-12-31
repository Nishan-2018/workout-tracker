import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getHealthMetrics, saveHealthMetric, getMetricTrend, getViewRange, setViewRange } from '../utils/healthStorage';

export default function HealthMetricCard({
    metricType,
    title,
    unit,
    inputType = 'number',
    chartColor = '#3b82f6',
    user
}) {
    const [metrics, setMetrics] = useState([]);
    const [newValue, setNewValue] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewRange, setViewRangeState] = useState(parseInt(getViewRange()));
    const [trend, setTrend] = useState({ trend: 'insufficient', label: '⚪ Insufficient Data', percentage: 0 });

    useEffect(() => {
        loadMetrics();
    }, [metricType, user]);

    useEffect(() => {
        // Recalculate trend when metrics or view range changes
        const trendData = getMetricTrend(metricType, viewRange === 0 ? 365 : viewRange);
        setTrend(trendData);
    }, [metrics, viewRange, metricType]);

    const loadMetrics = () => {
        const data = getHealthMetrics(metricType);
        setMetrics(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newValue || parseFloat(newValue) <= 0) return;

        const entry = {
            date: selectedDate,
            value: parseFloat(newValue),
            unit: unit,
            createdAt: new Date().toISOString()
        };

        const updatedMetrics = saveHealthMetric(metricType, entry, user?.uid);
        setMetrics(updatedMetrics);
        setNewValue('');
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    const handleViewRangeChange = (days) => {
        setViewRangeState(days);
        setViewRange(days);
    };

    // Prepare chart data
    const getChartData = () => {
        if (metrics.length === 0) return [];

        const cutoffDate = new Date();
        if (viewRange > 0) {
            cutoffDate.setDate(cutoffDate.getDate() - viewRange);
        } else {
            cutoffDate.setFullYear(cutoffDate.getFullYear() - 10); // All time
        }

        return metrics
            .filter(m => new Date(m.date) >= cutoffDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(m => ({
                date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: m.value
            }));
    };

    const chartData = getChartData();
    const latestMetric = metrics.length > 0 ? metrics[0] : null;

    return (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>{title}</h3>
                <span style={{
                    fontSize: '0.85rem',
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontWeight: '600'
                }}>
                    {trend.label}
                </span>
            </div>

            {/* Latest Value */}
            {latestMetric && (
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Latest</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {latestMetric.value} {latestMetric.unit}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {new Date(latestMetric.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
            )}

            {/* Time Range Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {[7, 30, 90, 0].map(days => (
                    <button
                        key={days}
                        type="button"
                        onClick={() => handleViewRangeChange(days)}
                        style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '16px',
                            background: viewRange === days ? 'var(--primary-color)' : 'var(--surface-color)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                        }}
                    >
                        {days === 0 ? 'All' : `${days}d`}
                    </button>
                ))}
            </div>

            {/* Chart */}
            {chartData.length > 0 ? (
                <div style={{ marginBottom: '1.5rem', height: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="date"
                                stroke="var(--text-secondary)"
                                style={{ fontSize: '0.75rem' }}
                            />
                            <YAxis
                                stroke="var(--text-secondary)"
                                style={{ fontSize: '0.75rem' }}
                                domain={['dataMin - 2', 'dataMax + 2']}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--surface-color)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={chartColor}
                                strokeWidth={2}
                                dot={{ fill: chartColor, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'var(--text-secondary)',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                    <div>No data yet.</div>
                    <div style={{ fontSize: '0.85rem' }}>Start tracking your {title.toLowerCase()}!</div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '120px' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {title}
                        </label>
                        <input
                            type={inputType}
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder={`Enter ${unit}`}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div style={{ flex: '1', minWidth: '120px' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
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
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap' }}
                    >
                        Log Entry
                    </button>
                </div>
            </form>
        </div>
    );
}
