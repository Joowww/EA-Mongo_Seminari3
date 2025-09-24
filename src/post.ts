import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId; 
  tags: string[];
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

export const PostModel = model<IPost>('Post', postSchema);