import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import BiodataCard from './components/BiodataCard';
import ThemeCustomizer from './components/ThemeCustomizer';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/members`)
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error('Failed to fetch members:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="layout">
      <Navbar />

      <main className="content">
        <header className="hero">
          <div className="hero-badge">PKPL</div>
          <h1 className="hero-title">Cayis Sang Penjaga.</h1>
          <p className="hero-subtitle">
            Bhineka Tunggal Ika. Walaupun salman make, kita tetap satu jua.
          </p>
        </header>

        <section className="members-section">
          {loading ? (
            <div className="grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid">
              {members.map((member, index) => (
                <BiodataCard key={index} member={member} index={index} />
              ))}
            </div>
          )}
        </section>

        {isAuthenticated && user?.isGroupMember && (
          <section className="admin-section">
            <div className="admin-header">
              <h2>Appearance Customization</h2>
              <p>Configure the aesthetic of the portfolio.</p>
            </div>
            <ThemeCustomizer />
          </section>
        )}
      </main>

      <footer className="footer">
        <p>CAYIS - Cello Ainur Yafi Izzati Salman.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
