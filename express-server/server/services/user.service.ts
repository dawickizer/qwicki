import { PopulateOptions, Schema } from 'mongoose';
import { User } from '../models/user';

export const createUser = async (user: User): Promise<User> => {
  try {
    user.usernameLower = user.username;
    return await User.create(user);
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Unable to create a new user.');
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    return await User.find({});
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Unable to retrieve users.');
  }
};

export const getUserById = async (
  userId: string | Schema.Types.ObjectId
): Promise<User | null> => {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw new Error(`Unable to retrieve user with ID ${userId}.`);
  }
};

export const getUserByIdAndPopulateFriends = async (
  id: string | Schema.Types.ObjectId
): Promise<User | null> => {
  try {
    const populateOptions: PopulateOptions = {
      path: 'friends',
      select: 'username',
    };
    return await User.findById(id).populate(populateOptions);
  } catch (error) {
    console.error(
      `Error fetching and populating friends for user with ID ${id}:`,
      error
    );
    throw new Error(
      `Unable to fetch and populate friends for user with ID ${id}.`
    );
  }
};

export const getUserByIdAndPopulateFriendRequests = async (
  id: string | Schema.Types.ObjectId
): Promise<User | null> => {
  try {
    const populateOptions: PopulateOptions[] = friendRequest(
      'inboundFriendRequests'
    ).concat(friendRequest('outboundFriendRequests'));
    return await User.findById(id).populate(populateOptions);
  } catch (error) {
    console.error(
      `Error fetching and populating friend requests for user with ID ${id}:`,
      error
    );
    throw new Error(
      `Unable to fetch and populate friend requests for user with ID ${id}.`
    );
  }
};

export const getUserByIdAndPopulateChildren = async (
  id: string | Schema.Types.ObjectId
): Promise<User | null> => {
  try {
    const friendsOptions: PopulateOptions = {
      path: 'friends',
      select: 'username',
    };

    const friendRequestsOptions: PopulateOptions[] = friendRequest(
      'inboundFriendRequests'
    ).concat(friendRequest('outboundFriendRequests'));

    return await User.findById(id)
      .populate(friendsOptions)
      .populate(friendRequestsOptions);
  } catch (error) {
    console.error(
      `Error fetching and populating children for user with ID ${id}:`,
      error
    );
    throw new Error(
      `Unable to fetch and populate children for user with ID ${id}.`
    );
  }
};

export const getUserByCredentials = async (credentials: {
  username: string;
  password: string;
}): Promise<User | null> => {
  try {
    return await User.findOne({
      usernameLower: credentials.username.toLowerCase(),
      password: credentials.password,
    });
  } catch (error) {
    console.error('Error fetching user by credentials:', error);
    throw new Error('Unable to retrieve user by credentials.');
  }
};

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  try {
    return await User.findOne({ usernameLower: username.toLowerCase() });
  } catch (error) {
    console.error(`Error fetching user by username ${username}:`, error);
    throw new Error(`Unable to retrieve user by username ${username}.`);
  }
};

export const updateUserById = async (
  id: string | Schema.Types.ObjectId,
  updatedUser: User
): Promise<User | null> => {
  try {
    updatedUser.usernameLower = updatedUser.username;
    const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });
    return user;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw new Error(`Unable to update user with ID ${id}.`);
  }
};

export const deleteUserById = async (
  userId: string | Schema.Types.ObjectId
): Promise<boolean> => {
  try {
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw new Error(`Unable to delete user with ID ${userId}.`);
  }
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
