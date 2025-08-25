import { User } from '../models/index.js';

export const getAnUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password_hash');
  if (!user) throw new Error(`User with ID ${id} not found`);
  res.status(200).json({ message: 'success', data: user });
};

export const getMyProfile = async (req, res) => {
  const { id } = req.user;
  console.log({ id });
  const user = await User.findById(id).select('-password_hash');
  if (!user) throw new Error(`User with ID ${id} not found`);
  res.status(200).json({ message: 'success', data: user });
};

export const getUsers = async (req, res) => {
  const { page = 1, limit = 10, search_keyword } = req.query;

  const query = {};

  if (search_keyword) {
    query.$or = [
      { name: { $regex: search_keyword, $options: 'i' } },
      { email: { $regex: search_keyword, $options: 'i' } },
    ];
  }

  const users = await User.find(query, null, {
    skip: (page - 1) * limit,
    limit: parseInt(limit),
  }).select('-password_hash');
  const user_count = await User.countDocuments();
  res.status(200).json({
    data: users,
    meta_data: { total_data: user_count, filtered_data: users.length },
  });
};
