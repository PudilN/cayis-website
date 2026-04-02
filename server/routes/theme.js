const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { isAuthenticated, isGroupMember } = require('../middleware/auth');

const THEME_FILE = path.join(__dirname, '..', 'data', 'theme.json');
const TMP_THEME_FILE = '/tmp/theme.json';

const VALID_PROPERTIES = {
  primaryColor: /^#[0-9A-Fa-f]{6}$/,
  secondaryColor: /^#[0-9A-Fa-f]{6}$/,
  backgroundColor: /^#[0-9A-Fa-f]{6}$/,
  cardColor: /^#[0-9A-Fa-f]{6}$/,
  textColor: /^#[0-9A-Fa-f]{6}$/,
  accentColor: /^#[0-9A-Fa-f]{6}$/,
  fontFamily: /^(Inter|Roboto|Outfit|Poppins|Montserrat|Open Sans|Lato|Raleway)$/,
  fontSize: /^(14|16|18|20)(px)?$/,
};

function readTheme() {
  if (fs.existsSync(TMP_THEME_FILE)) {
    return JSON.parse(fs.readFileSync(TMP_THEME_FILE, 'utf-8'));
  }
  return JSON.parse(fs.readFileSync(THEME_FILE, 'utf-8'));
}

router.get('/', (req, res) => {
  try {
    const theme = readTheme();
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read theme data: ' + err.message });
  }
});

router.put('/', isAuthenticated, isGroupMember, (req, res) => {
  try {
    const currentTheme = readTheme();
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      if (!VALID_PROPERTIES[key] || !VALID_PROPERTIES[key].test(String(value))) {
        return res.status(400).json({ error: `Invalid value for ${key}: ${value}` });
      }
    }

    const newTheme = { ...currentTheme, ...updates };
    
    // simpan tema
    try {
      fs.writeFileSync(THEME_FILE, JSON.stringify(newTheme, null, 2));
    } catch (writeErr) {
      if (writeErr.code === 'EROFS' || process.env.VERCEL) {
        fs.writeFileSync(TMP_THEME_FILE, JSON.stringify(newTheme, null, 2));
      } else {
        throw writeErr;
      }
    }

    res.json(newTheme);
  } catch (err) {
    console.error("Theme Update Error:", err);
    res.status(500).json({ error: 'Failed to update theme: ' + err.message });
  }
});

module.exports = router;
