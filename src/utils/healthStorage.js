import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LOCAL_HEALTH_METRICS_PREFIX = 'health_metrics_';
const LOCAL_VIEW_RANGE_KEY = 'health_metric_view_range';

// --- Helper for Syncing ---
export const fetchHealthMetrics = async (userId, metricType) => {
    try {
        const docRef = doc(db, "users", userId, "healthMetrics", metricType);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const cloudEntries = data.entries || [];

            // Merge with local data
            const localEntries = getHealthMetrics(metricType);
            const cloudDates = new Set(cloudEntries.map(e => e.date));

            const mergedEntries = [...cloudEntries];
            localEntries.forEach(e => {
                if (!cloudDates.has(e.date)) {
                    mergedEntries.push(e);
                }
            });

            // Sort by date (newest first)
            mergedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Update local storage
            localStorage.setItem(LOCAL_HEALTH_METRICS_PREFIX + metricType, JSON.stringify(mergedEntries));

            // Sync back to cloud if we found local-only items
            if (mergedEntries.length > cloudEntries.length) {
                saveHealthMetricsToCloud(userId, metricType, mergedEntries);
            }

            return mergedEntries;
        }
    } catch (e) {
        console.error("Error fetching health metrics from cloud", e);
    }
    return null;
};

export const saveHealthMetricsToCloud = async (userId, metricType, entries) => {
    try {
        await setDoc(doc(db, "users", userId, "healthMetrics", metricType), {
            entries,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
    } catch (e) {
        console.error("Error saving health metrics to cloud", e);
    }
};

// --- Local Storage Operations ---
export const getHealthMetrics = (metricType) => {
    try {
        const data = localStorage.getItem(LOCAL_HEALTH_METRICS_PREFIX + metricType);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading health metrics", error);
        return [];
    }
};

export const saveHealthMetric = (metricType, entry, userId = null) => {
    try {
        const metrics = getHealthMetrics(metricType);

        // Check if entry for this date already exists
        const existingIndex = metrics.findIndex(m => m.date === entry.date);

        let newMetrics;
        if (existingIndex >= 0) {
            // Update existing entry
            newMetrics = [...metrics];
            newMetrics[existingIndex] = entry;
        } else {
            // Add new entry
            newMetrics = [entry, ...metrics];
        }

        // Sort by date (newest first)
        newMetrics.sort((a, b) => new Date(b.date) - new Date(a.date));

        localStorage.setItem(LOCAL_HEALTH_METRICS_PREFIX + metricType, JSON.stringify(newMetrics));

        // Sync to cloud if user is logged in
        if (userId) {
            saveHealthMetricsToCloud(userId, metricType, newMetrics);
        }

        return newMetrics;
    } catch (error) {
        console.error("Error saving health metric", error);
        return [];
    }
};

export const deleteHealthMetric = (metricType, date, userId = null) => {
    try {
        const metrics = getHealthMetrics(metricType);
        const newMetrics = metrics.filter(m => m.date !== date);

        localStorage.setItem(LOCAL_HEALTH_METRICS_PREFIX + metricType, JSON.stringify(newMetrics));

        if (userId) {
            saveHealthMetricsToCloud(userId, metricType, newMetrics);
        }

        return newMetrics;
    } catch (error) {
        console.error("Error deleting health metric", error);
        return [];
    }
};

// --- Trend Detection ---
export const getMetricTrend = (metricType, days = 30) => {
    const metrics = getHealthMetrics(metricType);

    if (metrics.length < 3) {
        return { trend: 'insufficient', label: '⚪ Insufficient Data', percentage: 0 };
    }

    // Filter by date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filteredMetrics = metrics.filter(m => new Date(m.date) >= cutoffDate);

    if (filteredMetrics.length < 3) {
        return { trend: 'insufficient', label: '⚪ Insufficient Data', percentage: 0 };
    }

    // Sort by date (oldest first for calculation)
    const sortedMetrics = [...filteredMetrics].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate first 30% average and last 30% average
    const sampleSize = Math.max(1, Math.floor(sortedMetrics.length * 0.3));

    const firstSample = sortedMetrics.slice(0, sampleSize);
    const lastSample = sortedMetrics.slice(-sampleSize);

    const firstAvg = firstSample.reduce((sum, m) => sum + m.value, 0) / firstSample.length;
    const lastAvg = lastSample.reduce((sum, m) => sum + m.value, 0) / lastSample.length;

    const percentageChange = ((lastAvg - firstAvg) / firstAvg) * 100;

    // Determine trend
    if (Math.abs(percentageChange) <= 2) {
        return { trend: 'stable', label: '➖ Stable', percentage: percentageChange };
    } else if (percentageChange > 2) {
        return { trend: 'increasing', label: '📈 Increasing', percentage: percentageChange };
    } else {
        return { trend: 'decreasing', label: '📉 Decreasing', percentage: percentageChange };
    }
};

// --- View Range Preference ---
export const getViewRange = () => {
    return localStorage.getItem(LOCAL_VIEW_RANGE_KEY) || '30';
};

export const setViewRange = (days) => {
    localStorage.setItem(LOCAL_VIEW_RANGE_KEY, days.toString());
};
