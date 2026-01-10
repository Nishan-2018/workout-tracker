export const EXERCISE_Categories = {
    // Push (Chest/Triceps/Shoulders)
    'bench press': 'Chest',
    'push up': 'Chest',
    'incline bench': 'Chest',
    'chest fly': 'Chest',
    'overhead press': 'Shoulders',
    'military press': 'Shoulders',
    'lateral raise': 'Shoulders',
    'tricep extension': 'Triceps',
    'skull crusher': 'Triceps',
    'dips': 'Triceps',

    // Pull (Back/Biceps)
    'pull up': 'Back',
    'dumbbell row': 'Back',
    'lat pulldown': 'Back',
    'deadlift': 'Back',
    'bicep curl': 'Biceps',
    'hammer curl': 'Biceps',
    'face pull': 'Back',

    // Legs
    'squat': 'Legs',
    'leg press': 'Legs',
    'lunges': 'Legs',
    'leg extension': 'Legs',
    'hamstring curl': 'Legs',
    'calf raises': 'Legs',
    'goblet squat': 'Legs',
    'romanian deadlift': 'Legs',

    // Core
    'plank': 'Core',
    'crunches': 'Core',
    'leg raise': 'Core'
};

const CALORIES_PER_SET = 8; // Rough estimate per hard set
const BASE_CALORIES_PER_SESSION = 50; // Warmup + metabolic baseline

export const getMuscleGroup = (exerciseName) => {
    const normalized = exerciseName.toLowerCase();
    for (const [key, value] of Object.entries(EXERCISE_Categories)) {
        if (normalized.includes(key)) return value;
    }
    return 'Other';
};

export const calculateStats = (sessions, range = 'week') => {
    const now = new Date();
    const startPeriod = new Date();
    startPeriod.setHours(0, 0, 0, 0); // Start of today

    if (range === 'week') {
        startPeriod.setDate(startPeriod.getDate() - 7);
    } else if (range === 'month') {
        startPeriod.setMonth(startPeriod.getMonth() - 1);
    }

    const filteredSessions = sessions.filter(s => new Date(s.date) >= startPeriod);

    let totalCalories = 0;
    const muscleCounts = {};

    filteredSessions.forEach(session => {
        totalCalories += BASE_CALORIES_PER_SESSION;

        session.exercises.forEach(ex => {
            if (!ex.isCompleted) return;

            // Count valid sets for calories
            const validSets = ex.sets.filter(s => s.reps && s.reps > 0).length;
            totalCalories += (validSets * CALORIES_PER_SET);

            // Muscle mapping
            const muscle = getMuscleGroup(ex.name);
            muscleCounts[muscle] = (muscleCounts[muscle] || 0) + validSets;
        });
    });

    // Calculate percentages
    const totalSets = Object.values(muscleCounts).reduce((a, b) => a + b, 0);
    const muscleDistribution = Object.entries(muscleCounts)
        .map(([name, count]) => ({
            name,
            count,
            percentage: totalSets ? Math.round((count / totalSets) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count);

    return {
        totalWorkouts: filteredSessions.length,
        totalCalories,
        muscleDistribution
    };
};
