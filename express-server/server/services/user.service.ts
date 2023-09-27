import { PopulateOptions, Schema } from 'mongoose';
import { User } from '../models/user';
import NotFoundError from '../error/NotFoundError';
import * as friendRequestService from './friend-request.service';
import ConflictError from '../error/ConflictError';

export const createUser = async (user: User): Promise<User> => {
  user.usernameLower = user.username;
  user.emailLower = user.email;
  user.role = 'user';

  // Extract the fields you want to create off of to prevent unauthorized fields
  // that should not be modified
  const {
    username,
    usernameLower,
    email,
    emailLower,
    password,
    firstName,
    middleName,
    lastName,
    role,
  } = user;

  const userFields: Partial<User> = {
    username,
    usernameLower,
    email,
    emailLower,
    password,
    firstName,
    middleName,
    lastName,
    role,
  };

  return await User.create(userFields);
};

export const getAllUsers = async (): Promise<User[]> => {
  return await User.find({});
};

export const getUserById = async (
  userId: string | Schema.Types.ObjectId
): Promise<User> => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const getUserByIdAndPopulateFriends = async (
  userId: string | Schema.Types.ObjectId
): Promise<User> => {
  const populateOptions: PopulateOptions = {
    path: 'friends',
    select: 'username',
  };
  const user = await User.findById(userId).populate(populateOptions);
  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const getUserByIdAndPopulateFriendRequests = async (
  userId: string | Schema.Types.ObjectId
): Promise<User> => {
  const populateOptions: PopulateOptions[] = friendRequest(
    'inboundFriendRequests'
  ).concat(friendRequest('outboundFriendRequests'));
  const user = await User.findById(userId).populate(populateOptions);
  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const getUserByIdAndPopulateChildren = async (
  userId: string | Schema.Types.ObjectId
): Promise<User> => {
  const friendsOptions: PopulateOptions = {
    path: 'friends',
    select: 'username',
  };

  const friendRequestsOptions: PopulateOptions[] = friendRequest(
    'inboundFriendRequests'
  ).concat(friendRequest('outboundFriendRequests'));
  const user = await User.findById(userId)
    .populate(friendsOptions)
    .populate(friendRequestsOptions);
  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const getUserByCredentials = async (credentials: {
  username: string;
  password: string;
}): Promise<User> => {
  const user = await User.findOne({
    usernameLower: credentials.username.toLowerCase(),
    password: credentials.password,
  });
  if (!user) throw new NotFoundError(`Credentials Invalid`);
  return user;
};

export const getUserByUsername = async (username: string): Promise<User> => {
  const user = await User.findOne({ usernameLower: username.toLowerCase() });
  if (!user) throw new NotFoundError(`User not found. username: ${username}`);
  return user;
};

export const updateUserById = async (
  userId: string | Schema.Types.ObjectId,
  updatedUser: User
): Promise<User | null> => {
  updatedUser.usernameLower = updatedUser.username;
  updatedUser.emailLower = updatedUser.email;

  // Extract the fields you want to update from updatedUser to prevent unauthorized updates to fields
  //  that should not be modified
  const {
    username,
    usernameLower,
    email,
    emailLower,
    password,
    firstName,
    middleName,
    lastName,
  } = updatedUser;

  const updatedFields: Partial<User> = {
    username,
    usernameLower,
    email,
    emailLower,
    password,
    firstName,
    middleName,
    lastName,
  };

  const user = await User.findByIdAndUpdate(userId, updatedFields, {
    new: true,
  });
  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const addInboundFriendRequest = async (
  userId: Schema.Types.ObjectId,
  friendRequestId: Schema.Types.ObjectId
): Promise<User> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { inboundFriendRequests: friendRequestId } },
    { new: true }
  )
    .populate('friends', ['username'])
    .populate(friendRequest('inboundFriendRequests'))
    .populate(friendRequest('outboundFriendRequests'));

  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const addOutboundFriendRequest = async (
  userId: Schema.Types.ObjectId,
  friendRequestId: Schema.Types.ObjectId
): Promise<User> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { outboundFriendRequests: friendRequestId } },
    { new: true }
  )
    .populate('friends', ['username'])
    .populate(friendRequest('inboundFriendRequests'))
    .populate(friendRequest('outboundFriendRequests'));

  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const removeInboundFriendRequest = async (
  userId: Schema.Types.ObjectId,
  friendRequestId: Schema.Types.ObjectId
): Promise<User> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { inboundFriendRequests: friendRequestId } },
    { new: true }
  )
    .populate('friends', ['username'])
    .populate(friendRequest('inboundFriendRequests'))
    .populate(friendRequest('outboundFriendRequests'));
  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const removeOutboundFriendRequest = async (
  userId: Schema.Types.ObjectId,
  friendRequestId: Schema.Types.ObjectId
): Promise<User> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { outboundFriendRequests: friendRequestId } },
    { new: true }
  )
    .populate('friends', ['username'])
    .populate(friendRequest('inboundFriendRequests'))
    .populate(friendRequest('outboundFriendRequests'));
  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const addFriend = async (
  userId: string | Schema.Types.ObjectId,
  friendId: string | Schema.Types.ObjectId
): Promise<User> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { friends: friendId } },
    { new: true }
  )
    .populate('friends', ['username'])
    .populate(friendRequest('inboundFriendRequests'))
    .populate(friendRequest('outboundFriendRequests'));

  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const removeFriend = async (
  userId: string | Schema.Types.ObjectId,
  friendId: string | Schema.Types.ObjectId
): Promise<User> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { friends: friendId } },
    { new: true }
  )
    .populate('friends', ['username'])
    .populate(friendRequest('inboundFriendRequests'))
    .populate(friendRequest('outboundFriendRequests'));
  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const deleteUserById = async (
  userId: string | Schema.Types.ObjectId
): Promise<boolean> => {
  const result = await User.findByIdAndDelete(userId);
  await cleanupUserReferences(userId);
  if (!result) throw new NotFoundError(`User not found. ID: ${userId}`);
  return true;
};

export const cleanupUserReferences = async (
  userId: string | Schema.Types.ObjectId
): Promise<boolean> => {
  // Find all FriendRequest documents related to this user
  const relatedFriendRequests =
    await friendRequestService.getFriendRequestsByUserId(userId);

  // Extract the IDs of the related FriendRequests
  const relatedFriendRequestIds = relatedFriendRequests.map(fr => fr._id);

  // Remove user from friends list of other users
  await User.updateMany({ friends: userId }, { $pull: { friends: userId } });

  // Remove associated FriendRequests from other users’ inbound and outbound friend requests
  await User.updateMany(
    { inboundFriendRequests: { $in: relatedFriendRequestIds } },
    { $pull: { inboundFriendRequests: { $in: relatedFriendRequestIds } } }
  );

  await User.updateMany(
    { outboundFriendRequests: { $in: relatedFriendRequestIds } },
    { $pull: { outboundFriendRequests: { $in: relatedFriendRequestIds } } }
  );

  // Remove associated FriendRequests
  await friendRequestService.deleteManyFriendRequestsByUserId(userId);

  return true;
};

export const userExistsByUsername = async (
  username: string
): Promise<{ _id: any } | null> => {
  const result = await User.exists({ usernameLower: username.toLowerCase() });
  if (result) throw new ConflictError('Username taken');
  return result;
};

export const userExistsByEmail = async (
  email: string
): Promise<{ _id: any } | null> => {
  const result = await User.exists({ emailLower: email.toLowerCase() });
  if (result) throw new ConflictError('Email taken');
  return result;
};

const friendRequest = (path: string) => {
  return [
    // reference
    {
      path: path,
      model: 'FriendRequest',
      populate: [
        // reference
        {
          path: 'from',
          model: 'User',
          select: 'username',
        },
        {
          path: 'to',
          model: 'User',
          select: 'username',
        },
      ],
    },
  ];
};
