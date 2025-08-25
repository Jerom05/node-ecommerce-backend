import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

dotenv.config();

export const signup = async (req, res, session) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: 'Email already exists' });

  const password_hash = await bcrypt.hash(
    password,
    parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
  );

  const newUser = new User({
    name,
    email,
    password_hash,
  });
  await newUser.save({ session });
  const access_token = signToken(newUser);

  res.status(201).json({
    status: 'success',
    data: {
      access_token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        roles: newUser.roles,
      },
    },
  });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: 'Invalid email or password' });

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid)
    return res.status(401).json({ message: 'Invalid email or password' });

  const access_token = signToken(user);

  res.status(200).json({
    status: 'success',
    data: {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    },
  });
};

export const signToken = (user) =>
  jwt.sign({ id: user.id, roles: user.roles }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const getTokenFromHeader = (authorizationHeader) => {
  if (!authorizationHeader) return null;

  const [type, token] = authorizationHeader.split(' ');

  if (type !== 'Bearer') return null;

  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
