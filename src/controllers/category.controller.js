import { withTransaction } from '../utils/withTransaction.js';
import { categoryService } from '../services/index.js';
import { categoryQuery } from '../queries/index.js';

export const createCategory = async (req, res) => {
  await withTransaction(async (session) => {
    await categoryService.createCategory(req, res, session);
  });
};

export const updateCategory = async (req, res) => {
  await withTransaction(async (session) => {
    await categoryService.updatweCategory(req, res, session);
  });
};

export const deleteCategory = async (req, res) => {
  await withTransaction(async (session) => {
    await categoryService.deleteCategory(req, res, session);
  });
};

export const getCategory = async (req, res) => {
  await categoryQuery.getCategoryById(req, res);
};

export const getCategories = async (req, res) => {
  await categoryQuery.getAllCategories(req, res);
};
