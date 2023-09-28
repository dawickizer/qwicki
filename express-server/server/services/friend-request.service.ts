import { Schema } from 'mongoose';
import { FriendRequest } from '../models/friend-request';
import { User } from '../models/user';
import * as userService from './user.service';
import BadRequestError from '../error/BadRequestError';
import NotFoundError from '../error/NotFoundError';

export const getFriendRequestById = async (
  friendRequestId: string | Schema.Types.ObjectId
): Promise<FriendRequest> => {
  const friendRequest = await FriendRequest.findById(friendRequestId);
  if (!friendRequest)
    throw new NotFoundError(`Friend Request not found. ID: ${friendRequestId}`);
  return friendRequest;
};

export const getFriendRequestsByUserId = async (
  userId: string | Schema.Types.ObjectId
): Promise<FriendRequest[]> => {
  return await FriendRequest.find({ $or: [{ from: userId }, { to: userId }] });
};

export const createFriendRequest = async (
  userId: string | Schema.Types.ObjectId,
  toUsername: string
): Promise<User> => {
  // Retrieve both users in parallel.
  const [toUser, fromUser] = await Promise.all([
    userService.getUserByUsername(toUsername),
    userService.getUserById(userId),
  ]);

  // Ensure users are not the same
  if (toUser._id.equals(fromUser._id))
    throw new BadRequestError('You cannot send a friend request to yourself');

  // Ensure users are not already friends
  if (
    toUser.friends.includes(fromUser._id) ||
    fromUser.friends.includes(toUser._id)
  )
    throw new BadRequestError('You already are friends with this user');

  // Ensure there is no existing friend request between the users
  const existingRequest = await FriendRequest.findOne({
    $or: [
      { from: fromUser._id, to: toUser._id },
      { from: toUser._id, to: fromUser._id },
    ],
  });

  if (existingRequest)
    throw new BadRequestError(
      'There is already a friend request between these users'
    );

  // Create the friend request
  const friendRequest = await FriendRequest.create({
    from: fromUser._id,
    to: toUser._id,
  });

  // Update users' friend request arrays
  const [updatedFromUser] = await Promise.all([
    userService.addOutboundFriendRequest(fromUser._id, friendRequest._id),
    userService.addInboundFriendRequest(toUser._id, friendRequest._id),
  ]);

  return updatedFromUser;
};

export const deleteFriendRequestById = async (
  userId: string | Schema.Types.ObjectId,
  friendRequestId: string | Schema.Types.ObjectId
): Promise<User> => {
  const friendRequest = await getFriendRequestById(friendRequestId);

  if (!friendRequest) throw new NotFoundError('FriendRequest not found');

  // removing friendRequestId from inbound and outbound friend requests of both users
  await Promise.all([
    userService.removeInboundFriendRequest(
      friendRequest.from,
      friendRequestId as Schema.Types.ObjectId
    ),
    userService.removeOutboundFriendRequest(
      friendRequest.from,
      friendRequestId as Schema.Types.ObjectId
    ),
    userService.removeInboundFriendRequest(
      friendRequest.to,
      friendRequestId as Schema.Types.ObjectId
    ),
    userService.removeOutboundFriendRequest(
      friendRequest.to,
      friendRequestId as Schema.Types.ObjectId
    ),
  ]);

  await FriendRequest.findByIdAndDelete(friendRequestId);

  return await userService.getUserByIdAndPopulateChildren(userId);
};

export const deleteManyFriendRequestsByUserId = async (
  userId: string | Schema.Types.ObjectId
): Promise<boolean> => {
  await FriendRequest.deleteMany({ $or: [{ from: userId }, { to: userId }] });
  return true;
};
