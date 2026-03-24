const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // ambil profil google
      const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0]?.value || null,
      };

      // cek whitelist grup
      const allowedEmails = (process.env.ALLOWED_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase());
      user.isGroupMember = allowedEmails.includes(user.email.toLowerCase());

      return done(null, user);
    }
  )
);

module.exports = passport;
