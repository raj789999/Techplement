const allowViewItselfOnly = (req, res, next) => {
  const authenticatedUserId = req.user.id;
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;

  if (!objectIdRegex.test(req.params.userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format.",
    });
  }

  if (authenticatedUserId !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: You can only view your own account.",
    });
  }
  next();
};

export default allowViewItselfOnly;
