import { Schema } from 'mongoose';
import * as userService from './user.service';
import * as friendRequestService from './friend-request.service';
import { User } from '../models/user';
import NotFoundError from '../error/NotFoundError';
import BadRequestError from '../error/BadRequestError';

export const addFriend = async (
  userId: string | Schema.Types.ObjectId,
  friendRequestId: string | Schema.Types.ObjectId
): Promise<User> => {
  const friendRequest =
    await friendRequestService.getFriendRequestById(friendRequestId);

  if (userId != friendRequest.to) {
    throw new BadRequestError('This friend request is not addressed to you');
  }

  const toUser = await userService.getUserById(friendRequest.to);
  const fromUser = await userService.getUserById(friendRequest.from);

  if (!toUser.inboundFriendRequests.includes(friendRequest._id)) {
    throw new BadRequestError(
      'This friend request is not in your inbound friend requests list'
    );
  }

  if (toUser.friends.includes(friendRequest.from)) {
    throw new BadRequestError('You and this user are already friends');
  }

  // Fire off all promises concurrently since they are not dependant on each other
  await Promise.all([
    userService.removeInboundFriendRequest(toUser._id, friendRequest._id),
    userService.removeOutboundFriendRequest(fromUser._id, friendRequest._id),
    userService.addFriend(toUser._id, fromUser._id),
    userService.addFriend(fromUser._id, toUser._id),
    friendRequestService.deleteFriendRequestById(userId, friendRequest._id),
  ]);

  // Return the 'toUser' with its updated data and children data
  return await userService.getUserByIdAndPopulateChildren(toUser._id);
};

export const removeFriend = async (
  userId: string | Schema.Types.ObjectId,
  friendId: string | Schema.Types.ObjectId
): Promise<User> => {
  const friend = getFriendById(friendId);

  await Promise.all([
    userService.removeFriend(userId, friendId),
    userService.removeFriend(friendId, userId),
  ]);

  return friend;
};

export const getFriendById = async (
  friendId: string | Schema.Types.ObjectId
): Promise<User> => {
  const friend = await User.findById(friendId).select('_id username');
  if (!friend) throw new NotFoundError(`User not found. ID: ${friendId}`);
  return friend;
};

export const getFriendsByUserId = async (
  userId: string | Schema.Types.ObjectId
): Promise<User[]> => {
  const user = await User.findById(userId).populate('friends', 'username');
  return user?.friends || ([] as any);
};
