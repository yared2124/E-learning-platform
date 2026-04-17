export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).render("error", { message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).render("error", { message: "Forbidden" });
    }
    next();
  };
};
