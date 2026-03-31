const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  primaryColor: {
    type: String,
    required: true,
    default: '#000000',
    match: /^#[0-9A-Fa-f]{6}$/,
  },
  secondaryColor: {
    type: String,
    required: true,
    default: '#666666',
    match: /^#[0-9A-Fa-f]{6}$/,
  },
  backgroundColor: {
    type: String,
    required: true,
    default: '#FAFAFA',
    match: /^#[0-9A-Fa-f]{6}$/,
  },
  cardColor: {
    type: String,
    required: true,
    default: '#FFFFFF',
    match: /^#[0-9A-Fa-f]{6}$/,
  },
  textColor: {
    type: String,
    required: true,
    default: '#111111',
    match: /^#[0-9A-Fa-f]{6}$/,
  },
  accentColor: {
    type: String,
    required: true,
    default: '#000000',
    match: /^#[0-9A-Fa-f]{6}$/,
  },
  fontFamily: {
    type: String,
    required: true,
    default: 'Roboto',
    match: /^(Inter|Roboto|Outfit|Poppins|Montserrat|Open Sans|Lato|Raleway)$/,
  },
  fontSize: {
    type: String,
    required: true,
    default: '20',
    match: /^(14|16|18|20)(px)?$/,
  },
});

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
