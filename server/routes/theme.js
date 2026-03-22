const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { isAuthenticated, isGroupMember } = require('../middleware/auth');

const THEME_FILE = path.join(__dirname, '..', 'data', 'theme.json');

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

// Get current theme
router.get('/', (req, res) => {
  try {
    const theme = JSON.parse(fs.readFileSync(THEME_FILE, 'utf-8'));
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read theme data' });
  }
});

// Update theme (requires auth & group membership)
router.put('/', isAuthenticated, isGroupMember, (req, res) => {
  try {
    const currentTheme = JSON.parse(fs.readFileSync(THEME_FILE, 'utf-8'));
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      if (!VALID_PROPERTIES[key] || !VALID_PROPERTIES[key].test(String(value))) {
        return res.status(400).json({ error: `Invalid value for ${key}` });
      }
    }

    const newTheme = { ...currentTheme, ...updates };
    fs.writeFileSync(THEME_FILE, JSON.stringify(newTheme, null, 2));

    res.json(newTheme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update theme' });
  }
});

module.exports = router;
