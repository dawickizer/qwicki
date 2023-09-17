import { Schema } from 'mongoose';
import { FriendRequest } from '../models/friend-request';
import { User } from '../models/user';
import * as userService from './user.service';
import BadRequestError from '../error/BadRequestError';
import NotFoundError from '../error/NotFoundError';

export const getFriendRequestById = async (
  friendRequestId: string | Schema.Types.ObjectId
) => {
  const friendRequest = await FriendRequest.findById(friendRequestId);
  if (!friendRequest)
    throw new NotFoundError(`Friend Request not found. ID: ${friendRequestId}`);
  return friendRequest;
};

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

export const deleteFriendRequestById = async (
  friendRequestId: string | Schema.Types.ObjectId
): Promise<boolean> => {
  const friendRequest = await getFriendRequestById(friendRequestId);
  const fromUser = await userService.getUserById(friendRequest.from);
  const toUser = await userService.getUserById(friendRequest.to);

  const toUserInboundIndex = toUser.inboundFriendRequests.indexOf(
    friendRequestId as Schema.Types.ObjectId
  );
  const toUserOutboundIndex = toUser.outboundFriendRequests.indexOf(
    friendRequestId as Schema.Types.ObjectId
  );
  const fromUserInboundIndex = fromUser.inboundFriendRequests.indexOf(
    friendRequestId as Schema.Types.ObjectId
  );
  const fromUserOutboundIndex = fromUser.outboundFriendRequests.indexOf(
    friendRequestId as Schema.Types.ObjectId
  );

  if (
    toUserInboundIndex === -1 &&
    toUserOutboundIndex === -1 &&
    fromUserInboundIndex === -1 &&
    fromUserOutboundIndex === -1
  ) {
    throw new BadRequestError(
      'The friend request does not exist between these users.'
    );
  }

  if (toUserInboundIndex !== -1) {
    toUser.inboundFriendRequests.splice(toUserInboundIndex, 1);
  }

  if (toUserOutboundIndex !== -1) {
    toUser.outboundFriendRequests.splice(toUserOutboundIndex, 1);
  }

  if (fromUserInboundIndex !== -1) {
    fromUser.inboundFriendRequests.splice(fromUserInboundIndex, 1);
  }

  if (fromUserOutboundIndex !== -1) {
    fromUser.outboundFriendRequests.splice(fromUserOutboundIndex, 1);
  }

  // Save the updated users
  await toUser.save();
  await fromUser.save();

  // Delete the friend request
  await FriendRequest.findByIdAndDelete(friendRequestId);

  return true;
};
