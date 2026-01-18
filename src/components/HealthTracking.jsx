import HealthMetricCard from './HealthMetricCard';
import SupplementCard from './SupplementCard';

export default function HealthTracking({ user }) {
    return (
        <div style={{ marginTop: '3rem' }}>
            <h3 style={{
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.5rem'
            }}>
                Track Your Details
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                gap: '1.5rem'
            }}>
                {/* Body Weight Metric */}
                <HealthMetricCard
                    metricType="bodyWeight"
                    title="💪 Body Weight"
                    unit="kg"
                    inputType="number"
                    chartColor="#3b82f6"
                    user={user}
                />

                {/* Sleep Quality Metric */}
                <HealthMetricCard
                    metricType="sleepQuality"
                    title="😴 Sleep Quality"
                    unit="rating"
                    inputType="number"
                    chartColor="#9333ea"
                    user={user}
                    min={1}
                    max={5}
                />

                {/* Muscle Fatigue Metric */}
                <HealthMetricCard
                    metricType="muscleFatigue"
                    title="💪 Muscle Fatigue"
                    unit="%"
                    inputType="number"
                    chartColor="#ef4444"
                    user={user}
                    min={0}
                    max={100}
                />

                {/* Water Intake Metric */}
                <HealthMetricCard
                    metricType="waterIntake"
                    title="💧 Water Intake"
                    unit="L"
                    inputType="number"
                    chartColor="#06b6d4"
                    user={user}
                    min={0}
                />

                {/* Supplements Card */}
                <SupplementCard user={user} />
            </div>
        </div>
    );
}
