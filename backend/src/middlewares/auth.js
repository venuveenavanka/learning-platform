 
// ============================================
// FILE: src/middlewares/auth.js
// ============================================
const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Authentication failed', 401);
  }
};

module.exports = { authenticate };