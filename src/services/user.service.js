import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import _ from 'lodash';

export const updateUser = async (req, res, session) => {
  const { id } = req.params;

  const { password, email, name, status, add_roles, remove_roles } = req.body;

  console.log(password, email, name, status);

  const user = await User.findById(id, null, { session });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (email && user.email !== email.toLowerCase()) {
    const existingUser = await User.findOne({ email }, null, { session });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists' });
    user.email = email.toLowerCase();
  }

  if (name && user.name !== name) user.name = name;
  if (status && user.status !== status) user.status = status.toUpperCase();

  if (password && !(await bcrypt.compare(password, user.password_hash)))
    user.password_hash = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    );

  if (add_roles.length)
    user.roles = _.uniq(
      [...user.roles, ...add_roles].map((r) => r.toUpperCase())
    );

  if (remove_roles.length)
    user.roles = user.roles.filter((r) => !remove_roles.includes(r));

  await user.save({ session });
  user.password_hash = undefined;

  res.json({ message: 'User updated', data: user });
};
