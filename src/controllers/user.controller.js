import { userService } from '../services/index.js';
import { userQuery } from '../queries/index.js';
import { withTransaction } from '../utils/withTransaction.js';

export const getAnUser = async (req, res) => {
  await userQuery.getAnUser(req, res);
};

export const getMyProfile = async (req, res) => {
  console.log('my profile');
  console.log(req.user);
  await userQuery.getMyProfile(req, res);
};

export const getUsers = async (req, res) => {
  await userQuery.getUsers(req, res);
};

export const updateUser = async (req, res) => {
  await withTransaction(async (session) => {
    await userService.updateUser(req, res, session);
  });
};
