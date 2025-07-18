const User = require('../models/User');
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../config/jwt');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);
    
    if (!isValid) {
      return res.status(400).json(errors);
    }
    
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ email: 'Email already in use' });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });
    
    // Generate tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    
    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    
    res.status(201).json({
      success: true,
      token,
      refreshToken,
      user: userResponse,
    });
    
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body);
    
    if (!isValid) {
      return res.status(400).json(errors);
    }
    
    const { email, password, role } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ email: 'Invalid credentials' });
    }
    
    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is inactive' });
    }
    
    // Check if role matches
    if (role && user.role !== role) {
      return res.status(403).json({ message: 'Access denied for this role' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ password: 'Invalid credentials' });
    }
    
    // Generate tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    
    // Save refresh token to database
    user.refreshToken = refreshToken;
    user.lastActive = new Date();
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    
    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: userResponse,
    });
    
  } catch (err) {
    next(err);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user with this refresh token
    const user = await User.findOne({ 
      _id: decoded.userId, 
      refreshToken 
    });
    
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    
    // Generate new access token
    const newToken = generateToken(user._id, user.role);
    
    res.status(200).json({
      success: true,
      token: newToken,
    });
    
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
    
  } catch (err) {
    next(err);
  }
};