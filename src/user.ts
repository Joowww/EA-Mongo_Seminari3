import { Schema, model, Types } from 'mongoose';

// 1. Create an interface representing a TS object.
export interface IUser {
  name: string;
  email: string;
  avatar?: string;
  posts: Types.ObjectId[]; 
  _id?: Types.ObjectId;
}

// 2. Create a Schema corresponding to the document in MongoDB.
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }] 
});

// 3. Create a Model.
export const UserModel = model('User', userSchema);