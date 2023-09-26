import { PopulateOptions, Schema } from 'mongoose';
import { User } from '../models/user';
import NotFoundError from '../error/NotFoundError';

export const createUser = async (user: User): Promise<User> => {
  user.usernameLower = user.username;
  return await User.create(user);
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
  if (!user)
    throw new NotFoundError(
      `User not found. username: ${credentials.username}`
    );
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

    // Extract the fields you want to update from updatedUser to prevent unauthorized updates to fields
    //  that should not be modified
    const { username, usernameLower, email, password, firstName, middleName, lastName } = updatedUser;

    const updatedFields: Partial<User> = {
      username,
      usernameLower,
      email,
      password,
      firstName,
      middleName,
      lastName,
    };

  const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
  if (!user) throw new NotFoundError(`User not found. ID: ${userId}`);
  return user;
};

export const updateUserByIdAndPopulateChildren = async (
  userId: string | Schema.Types.ObjectId,
  updatedUser: User
): Promise<User | null> => {
  updatedUser.usernameLower = updatedUser.username;
  const user = await User.findOneAndUpdate({ _id: userId }, updatedUser, {
    new: true,
  })
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
  if (!result) throw new NotFoundError(`User not found. ID: ${userId}`);
  return true;
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
