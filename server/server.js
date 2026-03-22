require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const cors = require('cors');
const passport = require('./config/passport');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const themeRoutes = require('./routes/theme');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy is required for secure cookies behind Vercel's proxy
app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());

// Gunakan cookie-session agar data session tersimpan di cookie.
// Sangat penting untuk arsitektur serverless (Vercel).
app.use(
  cookieSession({
    name: 'biodata-session',
    keys: [process.env.SESSION_SECRET || 'fallback-secret'],
    maxAge: 24 * 60 * 60 * 1000,
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/theme', themeRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Biodata API Server',
    status: 'Running',
  });
});

app.get('/api/members', (req, res) => {
  try {
    const membersFile = path.join(__dirname, 'data', 'members.json');
    const members = JSON.parse(fs.readFileSync(membersFile, 'utf-8'));
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read members data' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
