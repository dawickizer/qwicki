import { Schema } from 'mongoose';
import { User } from '../models/user';
import NotFoundError from '../error/NotFoundError';
import * as friendRequestService from './friend-request.service';
import * as inviteService from './invite.service';
import ConflictError from '../error/ConflictError';

export const createUser = async (user: User): Promise<User> => {
  // run checks on fields that should be unique..will throw conflict errors
  await Promise.all([
    userExistsByUsername(user.username),
    userExistsByEmail(user.email),
  ]);

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
  userId: string | Schema.Types.ObjectId,
  query?: {
    friends?: boolean;
    friendRequests?: boolean;
    invites?: boolean;
  }
): Promise<User> => {
  const userQuery = User.findById(userId);

  // This array will hold all the populate options based on the query params.
  const populations = [];

  if (query?.friends) {
    populations.push({ path: 'friends', select: 'username' });
  }

  if (query?.friendRequests) {
    populations.push(friendRequest('inboundFriendRequests'));
    populations.push(friendRequest('outboundFriendRequests'));
  }

  if (query?.invites) {
    populations.push(invite('inboundInvites'));
    populations.push(invite('outboundInvites'));
  }

  populations.forEach(populateOptions => {
    userQuery.populate(populateOptions);
  });

  const user = await userQuery;
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
  updatedUserData: Partial<User>,
  query?: {
    friends?: boolean;
    friendRequests?: boolean;
    invites?: boolean;
  }
): Promise<User> => {
  // run checks on fields that should be unique..will throw conflict errors
  await Promise.all([
    userExistsByUsername(updatedUserData.username, { excludingUserId: userId }),
    userExistsByEmail(updatedUserData.email, { excludingUserId: userId }),
  ]);

  updatedUserData.usernameLower = updatedUserData.username;
  updatedUserData.emailLower = updatedUserData.email;

  // Extract the fields you want to update from updatedUser to prevent unauthorized updates to fields
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
  } = updatedUserData;

  const allowedFields: Partial<User> = {
    username,
    usernameLower,
    email,
    emailLower,
    password,
    firstName,
    middleName,
    lastName,
  };

  // Update the user with selected fields
  const updateQuery = User.findByIdAndUpdate(userId, allowedFields, {
    new: true,
  });

  // Dynamic population based on query parameters
  if (query?.friends) {
    updateQuery.populate({ path: 'friends', select: 'username' });
  }
  if (query?.friendRequests) {
    updateQuery.populate(friendRequest('inboundFriendRequests'));
    updateQuery.populate(friendRequest('outboundFriendRequests'));
  }
  if (query?.invites) {
    updateQuery.populate(invite('inboundInvites'));
    updateQuery.populate(invite('outboundInvites'));
  }

  const updatedUser = await updateQuery.exec();
  if (!updatedUser) throw new NotFoundError(`User not found. ID: ${userId}`);

  return updatedUser;
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

export const addInboundInvite = async (
  userId: Schema.Types.ObjectId,
  inviteId: Schema.Types.ObjectId
): Promise<User> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { inboundInvites: inviteId } },
    { new: true }
  )
    .populate('friends', ['username'])
    .populate(invite('inboundInvites'))
    .populate(invite('outboundInvites'));

  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const addOutboundInvite = async (
  userId: Schema.Types.ObjectId,
  inviteId: Schema.Types.ObjectId
): Promise<User> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { outboundInvites: inviteId } },
    { new: true }
  )
    .populate('friends', ['username'])
    .populate(invite('inboundInvites'))
    .populate(invite('outboundInvites'));

  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const removeInboundInvite = async (
  userId: Schema.Types.ObjectId,
  inviteId: Schema.Types.ObjectId
): Promise<User> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { inboundInvites: inviteId } },
    { new: true }
  )
    .populate('friends', ['username'])
    .populate(invite('inboundInvites'))
    .populate(invite('outboundInvites'));
  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const removeOutboundInvite = async (
  userId: Schema.Types.ObjectId,
  inviteId: Schema.Types.ObjectId
): Promise<User> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { outboundInvites: inviteId } },
    { new: true }
  )
    .populate('friends', ['username'])
    .populate(invite('inboundInvites'))
    .populate(invite('outboundInvites'));
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
  // Find all FriendRequest and Invite documents related to this user
  const relatedFriendRequests =
    await friendRequestService.getFriendRequestsByUserId(userId);
  const relatedInvites = await inviteService.getInvitesByUserId(userId);

  // Extract the IDs of the related FriendRequests and Invites
  const relatedFriendRequestIds = relatedFriendRequests.map(fr => fr._id);
  const relatedInviteIds = relatedInvites.map(invite => invite._id);

  // Remove user from friends list of other users
  await User.updateMany({ friends: userId }, { $pull: { friends: userId } });

  // Remove associated FriendRequests from other users’ inbound and outbound friend requests
  // and do the same for Invites
  await User.updateMany(
    {
      $or: [
        { inboundFriendRequests: { $in: relatedFriendRequestIds } },
        { outboundFriendRequests: { $in: relatedFriendRequestIds } },
        { inboundInvites: { $in: relatedInviteIds } },
        { outboundInvites: { $in: relatedInviteIds } },
      ],
    },
    {
      $pull: {
        inboundFriendRequests: { $in: relatedFriendRequestIds },
        outboundFriendRequests: { $in: relatedFriendRequestIds },
        inboundInvites: { $in: relatedInviteIds },
        outboundInvites: { $in: relatedInviteIds },
      },
    }
  );

  // Remove associated FriendRequests and Invites
  await friendRequestService.deleteManyFriendRequestsByUserId(userId);
  await inviteService.deleteManyInvitesByUserId(userId);

  return true;
};

export const userExistsByUsername = async (
  username: string,
  options?: { excludingUserId?: string | Schema.Types.ObjectId }
): Promise<{ _id: any } | null> => {
  const query: any = { usernameLower: username.toLowerCase() };
  if (options?.excludingUserId) {
    query['_id'] = { $ne: options.excludingUserId };
  }

  const result = await User.exists(query);
  if (result) throw new ConflictError('Username taken');
  return result;
};

export const userExistsByEmail = async (
  email: string,
  options?: { excludingUserId?: string | Schema.Types.ObjectId }
): Promise<{ _id: any } | null> => {
  const query: any = { emailLower: email.toLowerCase() };
  if (options?.excludingUserId) {
    query['_id'] = { $ne: options.excludingUserId };
  }

  const result = await User.exists(query);
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

const invite = (path: string) => {
  return [
    // reference
    {
      path: path,
      model: 'Invite',
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
