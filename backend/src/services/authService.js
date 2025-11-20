 
// ============================================
// FILE: src/services/authService.js
// ============================================
const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async register(userData) {
    const { full_name, email, password } = userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const password_hash = await hashPassword(password);

    const user = await User.create({
      full_name,
      email,
      password_hash
    });

    const token = generateToken({ userId: user.id });

    return {
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    };
  }

  async login(credentials) {
    const { email, password } = credentials;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({ userId: user.id });

    return {
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    };
  }
}

module.exports = new AuthService();