import passport from 'passport';

// Trigger Google login
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
});

// Handle callback from Google
export const googleAuthCallback = passport.authenticate('google', {
  failureRedirect: '/auth/failure',
  successRedirect: process.env.FRONTEND_URL || 'http://localhost:8080'
});

// Logout
export const logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};
