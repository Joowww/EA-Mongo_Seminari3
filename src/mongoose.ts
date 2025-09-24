import mongoose from 'mongoose';
import { UserModel, IUser } from './user.js';
import { PostModel, IPost } from './post.js';

async function main() {
  mongoose.set('strictQuery', true);

  await mongoose.connect('mongodb://localhost:27017/')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err: any) => console.error('Network error:', err));

  const user: IUser = {
    name: 'Bill',
    email: 'bill@initech.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png',
    posts: []
  };

  const newUser = new UserModel(user);
  const savedUser = await newUser.save();

  const post: Partial<IPost> = {
    title: 'My first post',
    content: 'Post content',
    author: savedUser._id,
    tags: ['tech', 'mongoose']
  };

  const newPost = new PostModel(post);
  const savedPost = await newPost.save();

  await UserModel.findByIdAndUpdate(savedUser._id, {
    $push: { posts: savedPost._id }
  });

  const userWithPosts = await UserModel.findById(savedUser._id)
    .populate('posts');
  console.log('Post user:', userWithPosts);

  const postWithAuthor = await PostModel.findById(savedPost._id)
    .populate('author');
  console.log('Author post:', postWithAuthor);

  await PostModel.findByIdAndUpdate(savedPost._id, {
    title: 'Updated title'
  });
  console.log('Updated pos');

  await PostModel.findByIdAndDelete(savedPost._id);
  console.log('Eliminated post');

  const usersWithPostCount = await UserModel.aggregate([
    {
      $lookup: {
        from: 'posts',
        localField: 'posts',
        foreignField: '_id',
        as: 'postDetails'
      }
    },
    {
      $project: {
        name: 1,
        email: 1,
        postCount: { $size: '$postDetails' },
        latestPost: { $arrayElemAt: ['$postDetails.title', 0] }
      }
    }
  ]);
  console.log('Users with post count:', usersWithPostCount);

  const postStats = await PostModel.aggregate([
    {
      $group: {
        _id: '$author',
        totalPosts: { $sum: 1 },
        avgContentLength: { $avg: { $strLenCP: '$content' } }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'authorInfo'
      }
    }
  ]);
  console.log('Post stadistics:', postStats);
}

main().catch(console.error);