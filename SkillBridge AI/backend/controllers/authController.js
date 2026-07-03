const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

exports.register = async (req, res) => {
let { name, email, password } = req.body;

// Normalize input
name = name?.trim();
email = email?.trim().toLowerCase();

// Required fields
if (!name || !email || !password) {
  return res.status(400).json({
    message: 'All fields are required',
  });
}

// Name validation
if (name.length < 3) {
  return res.status(400).json({
    message: 'Name must be at least 3 characters long',
  });
}

if (!/^[A-Za-z ]+$/.test(name)) {
  return res.status(400).json({
    message: 'Name can contain only letters and spaces',
  });
}

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: 'Please enter a valid email address',
  });
}

// Strong password validation
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message:
      'Password must be at least 6 characters and include uppercase, lowercase, number and special character.',
  });
}
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("EMAIL:", email);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');

  console.log("USER:", user);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await user.comparePassword(password);

  console.log("PASSWORD MATCH:", isMatch);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
    },
  });
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    targetRole: user.targetRole,
    createdAt: user.createdAt,
  });
};

exports.updateProfile = async (req, res) => {
  const { name, targetRole } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (targetRole !== undefined) updates.targetRole = targetRole;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    targetRole: user.targetRole,
  });
};
