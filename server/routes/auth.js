const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}?error=auth_failed` }),
  (req, res) => res.redirect(process.env.CLIENT_URL || 'http://localhost:5173')
);

router.get('/user', (req, res) => {
  if (!req.isAuthenticated()) return res.json({ isAuthenticated: false, user: null });
  
  res.json({
    isAuthenticated: true,
    user: {
      displayName: req.user.displayName,
      email: req.user.email,
      photo: req.user.photo,
      isGroupMember: req.user.isGroupMember,
    },
  });
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    req.session = null;
    res.clearCookie('biodata-session');
    res.clearCookie('biodata-session.sig');
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = router;
