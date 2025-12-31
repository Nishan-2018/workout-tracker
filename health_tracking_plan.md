# Health Tracking Feature - Implementation Plan

## Overview
Add a comprehensive health tracking system to IronTrack that allows users to monitor body weight over time with visual trend analysis. The system is designed to be extensible for future metrics like sleep quality, muscle fatigue, and water intake.

## User Story
As a real user of the web app, I want to track my weight at regular intervals and see the history displayed as a graph showing whether my weight is constant, increasing, or decreasing over time.

## Proposed Changes

### Phase 1: Install Chart Library
We need a charting library for visualizing weight trends.

**Action:** Install Recharts (lightweight, React-friendly)
```bash
npm install recharts
```

---

### Phase 2: Data Storage Layer

#### [NEW] [healthStorage.js](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/irontrack/workout-app/src/utils/healthStorage.js)

Create a new storage utility for health metrics that follows the same pattern as the existing workout storage.

**Functions to implement:**
- `getHealthMetrics(metricType)` - Get all entries for a metric type (e.g., 'bodyWeight')
- `saveHealthMetric(metricType, entry, userId)` - Save a new metric entry
- `deleteHealthMetric(metricType, date, userId)` - Delete a specific entry
- `getMetricTrend(metricType, days)` - Calculate trend (increasing/decreasing/stable)

**Firestore Structure:**
```
users/{userId}/healthMetrics/{metricType}/entries
  {
    date: "YYYY-MM-DD",
    value: number,
    unit: "kg",
    createdAt: timestamp
  }
```

**LocalStorage Keys:**
- `health_metrics_{metricType}` - Array of metric entries
- `health_metric_view_range` - Selected time range (7d/30d/90d/all)

---

### Phase 3: Reusable Components

#### [NEW] [HealthMetricCard.jsx](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/irontrack/workout-app/src/components/HealthMetricCard.jsx)

A generic, reusable card component for any health metric.

**Props:**
- `metricType` - Type of metric ('bodyWeight', 'sleep', etc.)
- `title` - Display title
- `unit` - Unit of measurement
- `inputType` - 'number' | 'range' | 'select'
- `chartColor` - Color for the graph line

**Features:**
- Input form to log new entry
- Line chart showing historical data
- Trend indicator (📈 Increasing / 📉 Decreasing / ➖ Stable)
- Time range selector (7d / 30d / 90d / All)
- Latest value display
- Empty state when no data exists

---

#### [NEW] [HealthTracking.jsx](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/irontrack/workout-app/src/components/HealthTracking.jsx)

Main section component that contains all health metric cards.

**Initial Implementation:**
- Section title: "Track Your Details"
- Grid layout for metric cards
- Initially shows only Body Weight card
- Designed to easily add more metric cards

---

### Phase 4: Trend Detection Algorithm

**Logic for trend calculation:**
1. Get data for selected time range
2. If less than 3 data points → "Not enough data"
3. Compare first 30% average vs last 30% average
4. If difference > 2% → Increasing/Decreasing
5. If difference ≤ 2% → Stable

**Trend Labels:**
- 📈 **Increasing** - Weight is going up
- 📉 **Decreasing** - Weight is going down  
- ➖ **Stable** - Weight is relatively constant
- ⚪ **Insufficient Data** - Need more entries

---

### Phase 5: Integration with App.jsx

#### [MODIFY] [App.jsx](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/irontrack/workout-app/src/App.jsx)

Add the HealthTracking component to the main app layout.

**Placement:** After WorkoutCategories section, before closing `</main>`

---

### Phase 6: Styling Enhancements

#### [MODIFY] [index.css](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/irontrack/workout-app/src/index.css)

Add CSS variables and classes for:
- Chart container styling
- Trend indicator badges
- Metric card hover effects
- Responsive grid for multiple metrics

---

## Data Model

### Body Weight Entry
```javascript
{
  date: "2025-12-29",        // ISO date string
  value: 75.5,               // Weight value
  unit: "kg",                // Unit of measurement
  createdAt: "2025-12-29T10:30:00Z"  // Timestamp
}
```

### Future Extensibility
The system is designed to support additional metrics with minimal code changes:

**Sleep Quality:**
```javascript
{
  date: "2025-12-29",
  value: 4,                  // 1-5 scale
  unit: "rating",
  createdAt: "..."
}
```

**Water Intake:**
```javascript
{
  date: "2025-12-29",
  value: 2.5,                // Liters
  unit: "L",
  createdAt: "..."
}
```

---

## UI/UX Design

### Card Layout
```
┌─────────────────────────────────────┐
│ 💪 Body Weight            [Trend 📈] │
│                                     │
│ Latest: 75.5 kg                     │
│                                     │
│ [7d] [30d] [90d] [All]             │
│                                     │
│     ┌─────────────────────┐        │
│     │   Line Chart        │        │
│     │   (Recharts)        │        │
│     └─────────────────────┘        │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Weight: [____] kg  [Log]    │   │
│ └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────┐
│ 💪 Body Weight                      │
│                                     │
│ No data yet.                        │
│ Start tracking your weight!         │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Weight: [____] kg  [Log]    │   │
│ └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## Verification Plan

### Manual Testing
1. **Add Entry:**
   - Log weight for today
   - Verify it appears in the chart
   - Check localStorage and Firestore (if logged in)

2. **Multiple Entries:**
   - Add entries for different dates
   - Verify chart updates correctly
   - Test time range filters (7d, 30d, etc.)

3. **Trend Detection:**
   - Add increasing weight values → should show 📈
   - Add decreasing weight values → should show 📉
   - Add similar weight values → should show ➖

4. **Edge Cases:**
   - No data → shows empty state
   - Single entry → shows "Insufficient Data"
   - Duplicate date → updates existing entry

5. **Responsiveness:**
   - Test on mobile viewport
   - Test on desktop viewport
   - Verify chart scales properly

---

## Future Extensions

Once the Body Weight feature is stable, adding new metrics is straightforward:

1. Define metric configuration
2. Add new `HealthMetricCard` instance
3. No changes needed to storage or chart logic

**Example - Adding Sleep Quality:**
```jsx
<HealthMetricCard
  metricType="sleepQuality"
  title="Sleep Quality"
  unit="rating"
  inputType="range"
  chartColor="#9333ea"
  min={1}
  max={5}
/>
```

---

## Technical Notes

- **Chart Library:** Recharts is chosen for its React-native API and small bundle size
- **Date Handling:** Use native JavaScript Date objects, store as ISO strings
- **Sync Strategy:** Same as workouts - localStorage first, Firebase if authenticated
- **Performance:** Limit chart to max 365 data points for smooth rendering
- **Accessibility:** Ensure chart has proper ARIA labels and keyboard navigation

---

## Success Criteria

✅ User can log body weight with date  
✅ Historical data displays as a line chart  
✅ Trend indicator shows increasing/decreasing/stable  
✅ Time range filters work correctly  
✅ Data persists in localStorage and Firebase  
✅ Empty state is clear and actionable  
✅ UI is responsive and matches app design  
✅ Code is extensible for future metrics
