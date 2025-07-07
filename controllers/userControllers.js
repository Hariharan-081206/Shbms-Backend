export const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }
  res.status(401).json({ message: 'Not authenticated' });
};
