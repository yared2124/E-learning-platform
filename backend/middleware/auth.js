import { verifyToken } from "../config/jwt.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
    res.locals.user = null;
    return next();
  }
  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, role: decoded.role };
    res.locals.user = req.user;
    next();
  } catch (err) {
    res.clearCookie("token");
    req.user = null;
    res.locals.user = null;
    next();
  }
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
};
