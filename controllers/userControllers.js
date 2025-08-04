export const getCurrentUser = (req, res) => {
  if (req.isAuthenticated?.()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};
