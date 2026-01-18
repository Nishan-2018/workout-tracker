# Workout Streak Feature - Implementation Plan

## Overview
Implement a GitHub-style workout streak indicator that visualizes daily workout activity with a calendar heatmap, showing current streak, longest streak, and total workouts.

## Visual Design (GitHub-style)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔥 Workout Streak                                           │
│                                                             │
│ Current Streak: 7 days    Longest: 21 days    Total: 156   │
│                                                             │
│ Mon  ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ │
│ Wed  ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ │
│ Fri  ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ │
│ Sun  ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ │
│                                                             │
│      Jan    Feb    Mar    Apr    May    Jun    Jul    Aug  │
│                                                             │
│ Legend: ░ None  ▓ 1-2  ▓ 3-4  ▓ 5+                        │
└─────────────────────────────────────────────────────────────┘
```

## Proposed Changes

### Component Architecture

#### [NEW] [WorkoutStreak.jsx](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/irontrack/workout-app/src/components/WorkoutStreak.jsx)

A component that displays workout activity in a GitHub-style heatmap.

**Features:**
- Calendar grid showing last 365 days (or configurable period)
- Color intensity based on workout count per day
- Hover tooltip showing date and workout count
- Current streak calculation
- Longest streak tracking
- Total workout count

**Props:**
- `sessions` - Array of workout sessions
- `user` - User object for potential future features

---

### Streak Calculation Logic

#### [MODIFY] [storage.js](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/irontrack/workout-app/src/utils/storage.js)

Add helper functions for streak calculations:

**Functions to Add:**
```javascript
export const getWorkoutStreak = () => {
  const sessions = getSessions();
  
  // Calculate current streak
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Sort sessions by date (newest first)
  const sortedSessions = sessions
    .map(s => new Date(s.date).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index) // Unique dates
    .sort((a, b) => new Date(b) - new Date(a));
  
  // Calculate streaks...
  
  return {
    currentStreak,
    longestStreak,
    totalWorkouts: sessions.length
  };
};

export const getWorkoutHeatmapData = (days = 365) => {
  const sessions = getSessions();
  const heatmapData = [];
  
  // Generate array of last N days with workout counts
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = sessions.filter(s => 
      new Date(s.date).toISOString().split('T')[0] === dateStr
    ).length;
    
    heatmapData.push({
      date: dateStr,
      count: count,
      level: getIntensityLevel(count) // 0-4 for color intensity
    });
  }
  
  return heatmapData;
};

const getIntensityLevel = (count) => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
};
```

---

### UI Implementation

#### Calendar Grid Layout

**Structure:**
- Grid of small squares (cells)
- Each cell represents one day
- Organized by weeks (rows) and days (columns)
- Color intensity based on workout count

**Color Scheme:**
```css
Level 0 (no workouts):    rgba(255,255,255,0.05)
Level 1 (1-2 workouts):   rgba(59, 130, 246, 0.3)  /* Light blue */
Level 2 (3-4 workouts):   rgba(59, 130, 246, 0.5)  /* Medium blue */
Level 3 (5-6 workouts):   rgba(59, 130, 246, 0.7)  /* Dark blue */
Level 4 (7+ workouts):    rgba(59, 130, 246, 1.0)  /* Full blue */
```

**Responsive Design:**
- Desktop: Show full year (52 weeks)
- Tablet: Show 6 months (26 weeks)
- Mobile: Show 3 months (13 weeks)

---

### Stats Display

**Metrics to Show:**
1. **🔥 Current Streak** - Consecutive days with workouts
2. **🏆 Longest Streak** - Best streak ever achieved
3. **💪 Total Workouts** - All-time workout count
4. **📅 This Week** - Workouts completed this week
5. **📊 This Month** - Workouts completed this month

---

### Tooltip on Hover

When hovering over a cell:
```
┌─────────────────────────┐
│ December 29, 2025       │
│ 3 workouts              │
│ • Back workout          │
│ • Chest workout         │
│ • Leg day               │
└─────────────────────────┘
```

---

### Integration

#### [MODIFY] [App.jsx](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/irontrack/workout-app/src/App.jsx)

Add WorkoutStreak component near the top of the main content, after the Header.

**Placement:**
```jsx
<Header />
<WorkoutStreak sessions={sessions} user={user} />
<main>
  {/* Rest of the content */}
</main>
```

---

## Streak Calculation Algorithm

### Current Streak
```
1. Get all unique workout dates (sorted newest to oldest)
2. Start from today
3. Check if there's a workout today or yesterday
4. If yes, count backwards day by day
5. Stop when we find a day without a workout
6. Return the count
```

### Longest Streak
```
1. Get all unique workout dates
2. Iterate through all dates
3. For each date, calculate consecutive days
4. Track the maximum consecutive count
5. Return the longest streak found
```

---

## Data Structure

### Heatmap Cell Object
```javascript
{
  date: "2025-12-29",      // ISO date string
  count: 3,                // Number of workouts
  level: 2,                // Intensity level (0-4)
  workouts: [              // Optional: workout details
    { name: "Back workout", exercises: 5 },
    { name: "Chest workout", exercises: 4 }
  ]
}
```

---

## CSS Styling

```css
.streak-container {
  background: var(--surface-color);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.streak-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.streak-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(53, 12px);
  grid-auto-rows: 12px;
  gap: 3px;
  overflow-x: auto;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  cursor: pointer;
  transition: transform 0.1s;
}

.heatmap-cell:hover {
  transform: scale(1.5);
  z-index: 10;
}

/* Responsive */
@media (max-width: 768px) {
  .heatmap-grid {
    grid-template-columns: repeat(26, 12px);
  }
}

@media (max-width: 480px) {
  .heatmap-grid {
    grid-template-columns: repeat(13, 12px);
  }
}
```

---

## Verification Plan

### Manual Testing

1. **Streak Calculation:**
   - Create workouts for consecutive days
   - Verify current streak increases
   - Skip a day, verify streak resets
   - Check longest streak is preserved

2. **Heatmap Display:**
   - Verify cells show correct colors
   - Hover over cells to see tooltips
   - Check dates are accurate
   - Verify workout counts are correct

3. **Responsive Design:**
   - Test on desktop (full year view)
   - Test on tablet (6 months view)
   - Test on mobile (3 months view)
   - Verify horizontal scrolling works

4. **Edge Cases:**
   - No workouts (empty state)
   - First workout ever
   - Multiple workouts same day
   - Workouts spanning years

---

## Future Enhancements

1. **Click to View Details:**
   - Click a cell to see workout details for that day
   - Show exercises performed

2. **Streak Milestones:**
   - Badges for 7, 30, 100, 365 day streaks
   - Celebration animations

3. **Comparison View:**
   - Compare current year vs previous year
   - Show improvement trends

4. **Export/Share:**
   - Share streak image on social media
   - Export workout calendar as image

5. **Streak Reminders:**
   - Notify user if streak is about to break
   - Motivational messages

---

## Technical Considerations

**Performance:**
- Memoize heatmap data calculation
- Use `useMemo` for expensive computations
- Lazy load older data if needed

**Accessibility:**
- Add ARIA labels to cells
- Keyboard navigation support
- Screen reader friendly tooltips

**Data Persistence:**
- Streak data calculated from existing sessions
- No additional storage needed
- Real-time updates when new workouts added

---

## Success Criteria

✅ Visual heatmap displays last 365 days  
✅ Current streak calculates correctly  
✅ Longest streak tracks accurately  
✅ Hover tooltips show workout details  
✅ Responsive on all device sizes  
✅ Updates in real-time when workouts added  
✅ Matches GitHub contribution graph aesthetic  
✅ Performance is smooth with 365+ data points
