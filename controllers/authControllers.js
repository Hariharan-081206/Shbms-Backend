import passport from 'passport';

// Trigger Google login
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
});

// Handle callback from Google
export const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL + '/login',
  })(req, res, () => {
    // Successful login — redirect to frontend
    res.redirect(process.env.FRONTEND_URL + '/dashboard'); // or '/home' or wherever you want
  });
};


// Logout
export const logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};
