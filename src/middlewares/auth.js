import { getTokenFromHeader, verifyToken } from '../services/auth.service.js';
import User from '../models/user.model.js';

export const auth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = verifyToken(token);
    const user = await User.findOne({ _id: payload.id });
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = {
      id: user.id,
      roles: user.roles,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    res.clearCookie('access_token');
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireRoles = (requiredRoles = ['USER']) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];

    if (!requiredRoles.some((role) => userRoles.includes(role))) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
