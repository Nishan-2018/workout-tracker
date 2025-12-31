export default function Header() {
    return (
        <header style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <h1 style={{
                fontSize: '3rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
            }}>
                IronTrack <span style={{ fontSize: '1rem', verticalAlign: 'middle', background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '4px', marginLeft: '10px' }}>BETA</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                Your daily workout companion.
            </p>
        </header>
    );
}
