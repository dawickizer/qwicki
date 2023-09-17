import { Schema } from 'mongoose';
import { FriendRequest } from '../models/friend-request';
import { User } from '../models/user';
import * as userService from './user.service';
import BadRequestError from '../error/BadRequestError';

export const createFriendRequest = async (
  userId: string | Schema.Types.ObjectId,
  toUsername: string
): Promise<User> => {
  let toUser = await userService.getUserByUsername(toUsername);
  let fromUser = await userService.getUserById(userId);
  const friendRequest = new FriendRequest();

  if (toUser.id === fromUser.id)
    throw new BadRequestError('You cannot send a friend request to yourself');
  if (
    toUser.friends.includes(fromUser._id) ||
    fromUser.friends.includes(toUser._id)
  )
    throw new BadRequestError('You already are friends with this user');
  for (const fromUserOutboundFriendRequest of fromUser.outboundFriendRequests)
    if (toUser.inboundFriendRequests.includes(fromUserOutboundFriendRequest))
      throw new BadRequestError(
        'You already sent a friend request to this user'
      );
  for (const fromUserInboundFriendRequest of fromUser.inboundFriendRequests)
    if (toUser.outboundFriendRequests.includes(fromUserInboundFriendRequest))
      throw new BadRequestError('This user already sent you a friend request');

  // Create and configure the friend request object
  friendRequest.to = toUser._id;
  friendRequest.from = fromUser._id;
  friendRequest.createdAt = new Date();
  friendRequest.accepted = false;

  // Update the users' friend request arrays
  toUser.inboundFriendRequests.push(friendRequest._id);
  fromUser.outboundFriendRequests.push(friendRequest._id);

  // Persist the friend request
  await FriendRequest.create(friendRequest);

  // Persist the updated to user and from user
  toUser = await userService.updateUserById(toUser._id, toUser);
  fromUser = await userService.updateUserByIdAndPopulateChildren(
    fromUser._id,
    fromUser
  );

  return fromUser;
};
