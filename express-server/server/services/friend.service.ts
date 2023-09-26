import { Schema } from 'mongoose';
import * as userService from './user.service';
import * as friendRequestService from './friend-request.service'
import { User } from '../models/user';
import NotFoundError from '../error/NotFoundError';
import BadRequestError from '../error/BadRequestError';


// STILL NOT WORKING HOW I WANT WHEN TRYING TO POPULATE THE USER WITH HIS CHILD DATA
export const addFriendForUser = async (
  userId: string | Schema.Types.ObjectId,
  friendRequestId: string | Schema.Types.ObjectId
): Promise<User> => {

  const friendRequest = await friendRequestService.getFriendRequestById(friendRequestId);
  let toUser = await userService.getUserById(friendRequest.to);
  const fromUser = await userService.getUserById(friendRequest.from);

  if (userId != friendRequest.to) {
    throw new BadRequestError("This friend request is not addressed to you")
  }
  
  if (!toUser.inboundFriendRequests.includes(friendRequest._id)) {
    throw new BadRequestError("This friend request is not addressed to you")
  }

  if (toUser.friends.includes(friendRequest.from)) {
    throw new BadRequestError("You and this user are already friends")
  }
  // Refresh the toUser after deleting the friend request
  await friendRequestService.deleteFriendRequestById(friendRequest._id);
  toUser = await userService.getUserByIdAndPopulateChildren(friendRequest.to);

  toUser.friends.push(friendRequest.from);
  fromUser.friends.push(friendRequest.to);

  await toUser.save();
  await fromUser.save();
  return toUser;
}

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
