const router = require('express').Router();
const { isAuthenticated, isGroupMember } = require('../middleware/auth');
const mongoose = require('mongoose');
const Theme = require('../models/Theme');

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

const DEFAULT_THEME = {
  primaryColor: "#000000",
  secondaryColor: "#666666",
  backgroundColor: "#FAFAFA",
  cardColor: "#FFFFFF",
  textColor: "#111111",
  accentColor: "#000000",
  fontFamily: "Roboto",
  fontSize: "20"
};

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(DEFAULT_THEME);
    }

    let theme = await Theme.findOne({});
    if (!theme) {
      theme = DEFAULT_THEME;
    }
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read theme data: ' + err.message });
  }
});

router.put('/', isAuthenticated, isGroupMember, async (req, res) => {
  try {
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      if (!VALID_PROPERTIES[key] || !VALID_PROPERTIES[key].test(String(value))) {
        return res.status(400).json({ error: `Invalid value for ${key}: ${value}` });
      }
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Theme updates are temporarily unavailable.' });
    }

    let theme = await Theme.findOne({});
    if (!theme) {
      theme = new Theme(DEFAULT_THEME);
    }

    Object.assign(theme, updates);
    await theme.save();

    res.json(theme);
  } catch (err) {
    console.error("Theme Update Error:", err);
    res.status(500).json({ error: 'Failed to update theme: ' + err.message });
  }
});

module.exports = router;
