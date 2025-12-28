import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const photoSchema = new Schema(
  {
    image: String,
    title: String,
    likes: Array,
    comments: Array,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: String,
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;
