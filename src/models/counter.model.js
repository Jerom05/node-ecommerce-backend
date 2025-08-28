import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
  },
});

counterSchema.statics.getNextSequence = async function (name) {
  const counter = await this.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
