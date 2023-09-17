import { Schema } from 'mongoose';
import * as userService from './user.service';
import { User } from '../models/user';
import NotFoundError from '../error/NotFoundError';
import BadRequestError from '../error/BadRequestError';

export const addFriendForUser = async (
  userId: string | Schema.Types.ObjectId,
  friendId: string | Schema.Types.ObjectId
): Promise<User> => {
  const user = await userService.getUserById(userId as Schema.Types.ObjectId);
  if (!user.friends.includes(friendId as Schema.Types.ObjectId)) {
    user.friends.push(friendId as Schema.Types.ObjectId);
  }
  await user.save();
  return await getFriendById(friendId);
};

export const deleteFriendFromUser = async (
  userId: string | Schema.Types.ObjectId,
  friendId: string | Schema.Types.ObjectId
): Promise<boolean> => {
  const user = await userService.getUserById(userId as Schema.Types.ObjectId);
  const friendIndexInUser = user.friends.indexOf(
    friendId as Schema.Types.ObjectId
  );
  if (friendIndexInUser === -1)
    throw new BadRequestError(`User not in friends list`);
  user.friends.splice(friendIndexInUser, 1);
  await user.save();
  return true;
};

export const getFriendById = async (
  friendId: string | Schema.Types.ObjectId
): Promise<User> => {
  const friend = await User.findById(friendId).select('_id username');
  if (!friend) throw new NotFoundError(`User not found. ID: ${friendId}`);
  return friend;
};
