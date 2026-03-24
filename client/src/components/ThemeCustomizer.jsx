import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeCustomizer.css';

const FONT_OPTIONS = [
  'Inter', 'Roboto', 'Outfit', 'Poppins', 'Montserrat', 'Open Sans', 'Lato', 'Raleway',
];

const FONT_SIZE_OPTIONS = ['14', '16', '18', '20'];

const THEME_PRESETS = [
  {
    id: 'light',
    name: 'Light / Minimal',
    colors: {
      primaryColor: '#000000',
      secondaryColor: '#666666',
      backgroundColor: '#FAFAFA',
      cardColor: '#FFFFFF',
      textColor: '#111111',
      accentColor: '#000000',
    }
  },
  {
    id: 'dark',
    name: 'Dark / Sleek',
    colors: {
      primaryColor: '#FFFFFF',
      secondaryColor: '#A0A0A0',
      backgroundColor: '#0A0A0A',
      cardColor: '#141414',
      textColor: '#EDEDED',
      accentColor: '#FFFFFF',
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    colors: {
      primaryColor: '#60A5FA',
      secondaryColor: '#94A3B8',
      backgroundColor: '#0F172A',
      cardColor: '#1E293B',
      textColor: '#F8FAFC',
      accentColor: '#3B82F6',
    }
  }
];

export default function ThemeCustomizer() {
  const { theme, updateTheme } = useTheme();
  const [localTheme, setLocalTheme] = useState(theme);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (preset) => {
    setLocalTheme((prev) => ({
      ...prev,
      ...preset.colors
    }));
  };

  const handleFontChange = (value) => {
    setLocalTheme((prev) => ({ ...prev, fontFamily: value }));
  };

  const handleFontSizeChange = (value) => {
    setLocalTheme((prev) => ({ ...prev, fontSize: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const result = await updateTheme(localTheme);
    setSaving(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Tema berhasil disimpan dan diterapkan ke seluruh pengguna!' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Gagal menyimpan tema' });
    }

    setTimeout(() => setMessage(null), 4000);
  };


  const activePresetId = THEME_PRESETS.find(p => p.colors.backgroundColor === localTheme.backgroundColor)?.id;

  return (
    <div className={`theme-customizer ${isOpen ? 'open' : ''}`}>
      <button className="customizer-toggle" onClick={() => setIsOpen(!isOpen)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
        <span>Customize Tema Global</span>
        <svg className={`chevron ${isOpen ? 'rotated' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>

      {isOpen && (
        <div className="customizer-panel">
          <div className="customizer-section">
            <h4 className="section-title">Pilih Skema Warna</h4>
            <div className="presets-grid">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  className={`preset-btn ${activePresetId === preset.id ? 'active' : ''}`}
                  onClick={() => handlePresetSelect(preset)}
                  style={{
                    backgroundColor: preset.colors.backgroundColor,
                    borderColor: preset.colors.cardColor,
                  }}
                >
                  <div className="preset-preview">
                    <div className="preset-circle" style={{ background: preset.colors.primaryColor }}></div>
                    <div className="preset-circle" style={{ background: preset.colors.textColor }}></div>
                  </div>
                  <span style={{ color: preset.colors.textColor }}>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="customizer-section">
            <h4 className="section-title">Font</h4>
            <div className="font-options">
              <div className="select-wrapper">
                <label>Font Family</label>
                <select
                  value={localTheme.fontFamily}
                  onChange={(e) => handleFontChange(e.target.value)}
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div className="select-wrapper">
                <label>Font Size</label>
                <select
                  value={localTheme.fontSize}
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                >
                  {FONT_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}px
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="customizer-actions">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Tema Global'}
            </button>
          </div>

          {message && (
            <div className={`customizer-message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
