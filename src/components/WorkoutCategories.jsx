import { useState } from 'react';
import categoriesData from '../data/categories.json';

export default function WorkoutCategories() {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <div style={{ marginTop: '3rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Beginner Training Plans</h3>

            {!selectedCategory ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {categoriesData.map(category => (
                        <div
                            key={category.id}
                            className="glass-panel hover-card"
                            style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => setSelectedCategory(category)}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.75rem' }}>{category.name}</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{category.description}</p>
                            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--primary-color)' }}>View {category.exercises.length} Exercises →</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-panel fade-in" style={{ padding: '2rem' }}>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        style={{ background: 'transparent', color: 'var(--primary-color)', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
                    >
                        ← Back to Categories
                    </button>
                    <h2 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{selectedCategory.name}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{selectedCategory.description}</p>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {selectedCategory.exercises.map((ex, i) => (
                            <div key={i} style={{ borderLeft: '4px solid var(--primary-color)', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0 8px 8px 0' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{ex.name}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{ex.details}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
