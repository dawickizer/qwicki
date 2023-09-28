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

export const checkUnviewedMessages = async (): Promise<void> => {};

export const markMessagesAsViewed = async (): Promise<void> => {};

//   async hasUnviewedMessages(req: any): Promise<boolean> {
//     const requestor: User | null = await this.userService.get(
//       req.body.decodedJWT._id
//     );
//     const requested: User | null = await this.userService.get(req.params.id);
//     const unviewedMessages = await Message.find({
//       $and: [{ to: requestor._id }, { from: requested._id }, { viewed: false }],
//     });
//     return unviewedMessages && unviewedMessages.length > 0 ? true : false;
//   }

//   async markUnviewedMessagesAsViewed(req: any): Promise<boolean> {
//     const requestor: User | null = await this.userService.get(
//       req.body.decodedJWT._id
//     );
//     const requested: User | null = await this.userService.get(req.params.id);
//     await Message.updateMany(
//       {
//         $and: [
//           { to: requestor._id },
//           { from: requested._id },
//           { viewed: false },
//         ],
//       },
//       { viewed: true }
//     );
//     return false;
//   }

//   async getMessagesBetween(req: any): Promise<Message[]> {
//     const requestor: User | null = await this.userService.get(
//       req.body.decodedJWT._id
//     );
//     const requested: User | null = await this.userService.get(req.params.id);
//     return await Message.find({
//       $or: [
//         { $and: [{ to: requestor._id }, { from: requested._id }] },
//         { $and: [{ to: requested._id }, { from: requestor._id }] },
//       ],
//     }).sort('createdAt');
//   }

//   async getMessagesBetweenAndPopulate(req: any): Promise<Message[]> {
//     const requestor: User | null = await this.userService.get(
//       req.body.decodedJWT._id
//     );
//     const requested: User | null = await this.userService.get(req.params.id);
//     return await Message.find({
//       $or: [
//         { $and: [{ to: requestor._id }, { from: requested._id }] },
//         { $and: [{ to: requested._id }, { from: requestor._id }] },
//       ],
//     })
//       .populate(this.user('from'))
//       .populate(this.user('to'))
//       .sort('createdAt');
//   }

export const user = (path: string) => {
  return [
    {
      path: path,
      model: 'User',
      select: 'username',
    },
  ];
};
