export const EXERCISE_Categories = {
    // Chest
    'bench press': 'Chest',
    'incline press': 'Chest',
    'decline press': 'Chest',
    'chest press': 'Chest',
    'push up': 'Chest',
    'chest fly': 'Chest',
    'pec deck': 'Chest',
    'pullover': 'Chest',
    'cable crossover': 'Chest',
    'dip': 'Chest', // Weighted dips often chest focused, or triceps. Context hard.

    // Back
    'pull up': 'Back',
    'chin up': 'Back',
    'lat pulldown': 'Back',
    'row': 'Back', // Catch-all for dumbbell row, cable row, barbell row
    'deadlift': 'Back',
    'face pull': 'Back',
    'hyper extension': 'Back',
    'good morning': 'Back',

    // Shoulders
    'overhead press': 'Shoulders',
    'military press': 'Shoulders',
    'shoulder press': 'Shoulders',
    'lateral raise': 'Shoulders',
    'front raise': 'Shoulders',
    'rear delt': 'Shoulders',
    'arnold press': 'Shoulders',
    'shrug': 'Shoulders',
    'upright row': 'Shoulders',

    // Legs (Quads/Hams/Glutes/Calves)
    'squat': 'Legs', // Front, back, goblet
    'leg press': 'Legs',
    'lunge': 'Legs',
    'step up': 'Legs',
    'leg extension': 'Legs',
    'leg curl': 'Legs',
    'hamstring': 'Legs',
    'calf': 'Legs',
    'hip thrust': 'Legs',
    'glute': 'Legs',
    'bulgarian': 'Legs', // split squats
    'hack squat': 'Legs',
    'rdl': 'Legs', // Romanian Deadlift

    // Biceps
    'curl': 'Biceps', // Barbell, dumbbell, hammer, preacher

    // Triceps
    'tricep': 'Triceps',
    'skull crusher': 'Triceps',
    'close grip bench': 'Triceps',
    'pushdown': 'Triceps',
    'kickback': 'Triceps',

    // Core
    'plank': 'Core',
    'crunch': 'Core',
    'sit up': 'Core',
    'leg raise': 'Core',
    'russian twist': 'Core',
    'ab wheel': 'Core',
    'mountain climber': 'Core',

    // Cardio
    'run': 'Cardio',
    'treadmill': 'Cardio',
    'cycle': 'Cardio',
    'bike': 'Cardio',
    'elliptical': 'Cardio',
    'rowing': 'Cardio'
};

const CALORIES_PER_SET = 8;
const BASE_CALORIES_PER_SESSION = 50;

export const getMuscleGroup = (exerciseName) => {
    const normalized = exerciseName.toLowerCase();

    // Sort keys by length descending to match specific terms first 
    // (e.g. 'chest press' before 'press' if we had a generic press)
    const keys = Object.keys(EXERCISE_Categories).sort((a, b) => b.length - a.length);

    for (const key of keys) {
        if (normalized.includes(key)) return EXERCISE_Categories[key];
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
