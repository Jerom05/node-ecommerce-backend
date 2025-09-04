import { withTransaction } from '../utils/with-transaction.js';
import { authService } from '../services/index.js';

export const signup = async (req, res) => {
  await withTransaction(async (session) => {
    await authService.signup(req, res, session);
  });
};

export const signin = async (req, res) => {
  withTransaction(async (session) => {
    await authService.signin(req, res, session);
  });
};
