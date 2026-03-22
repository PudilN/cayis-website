// Check if the user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Unauthorized' });
};

// Check if the logged-in user is an approved group member
const isGroupMember = (req, res, next) => {
  if (req.user?.isGroupMember) return next();
  return res.status(403).json({ error: 'Forbidden' });
};

module.exports = { isAuthenticated, isGroupMember };
