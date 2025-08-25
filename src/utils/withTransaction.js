import mongoose from 'mongoose';

export async function withTransaction(callback) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await callback(session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
