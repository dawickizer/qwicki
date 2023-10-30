import { Schema } from 'mongoose';
import { Message } from '../models/message';
import * as userService from './user.service';
import BadRequestError from '../error/BadRequestError';

export const getMessages = async (
  userId: string | Schema.Types.ObjectId,
  friendId: string | Schema.Types.ObjectId
): Promise<Message[]> => {
  const requestor = await userService.getUserById(userId);
  const requested = await userService.getUserById(friendId);
  return await Message.find({
    $or: [
      { $and: [{ to: requestor._id }, { from: requested._id }] },
      { $and: [{ to: requested._id }, { from: requestor._id }] },
    ],
  })
    .populate(user('from'))
    .populate(user('to'))
    .sort('createdAt');
};

export const createMessage = async (
  userId: string | Schema.Types.ObjectId,
  friendId: string | Schema.Types.ObjectId,
  content: string
): Promise<Message> => {
  if (userId === friendId)
    throw new BadRequestError('You cannot message yourself');

  const fromUser = await userService.getUserById(userId);
  const toUser = await userService.getUserById(friendId);

  if (!fromUser.friends.includes(toUser._id))
    throw new BadRequestError(
      'You cannot send a message to someone that is not your friend'
    );

  const message = await Message.create({
    to: toUser._id,
    from: fromUser._id,
    createdAt: new Date(),
    content: content,
  });

  return await Message.findById(message._id)
    .populate(user('from'))
    .populate(user('to'));
};

export const unviewedMessagesCount = async (
  userId: string | Schema.Types.ObjectId,
  friendId: string | Schema.Types.ObjectId
): Promise<number> => {
  const count = await Message.exists({
    $and: [{ to: userId }, { from: friendId }, { viewed: false }],
  }).count();

  return count;
};

export const markMessagesAsViewed = async (
  userId: string | Schema.Types.ObjectId,
  friendId: string | Schema.Types.ObjectId,
  messageIds: string | Schema.Types.ObjectId[]
): Promise<Message[]> => {
  await Message.updateMany(
    {
      $and: [
        { _id: { $in: messageIds } },
        { to: userId },
        { from: friendId },
        { viewed: false },
      ],
    },
    { viewed: true }
  );
  const updatedMessages = await Message.find({ _id: { $in: messageIds } })
    .populate(user('from'))
    .populate(user('to'));
  return updatedMessages;
};

export const user = (path: string) => {
  return [
    {
      path: path,
      model: 'User',
      select: 'username',
    },
  ];
};
