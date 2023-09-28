import { Schema } from 'mongoose';
import { Message } from '../models/message';
import * as userService from './user.service';
import BadRequestError from '../error/BadRequestError';

export const getMessages = async (): Promise<Message[]> => {
  return null;
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

  return (
    await Message.create({
      to: toUser._id,
      from: fromUser._id,
      createdAt: new Date(),
      content: content,
    })
  ).populate([
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
  ]);
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

//   private user(path: string) {
//     return [
//       // reference
//       {
//         path: path,
//         model: 'User',
//         select: 'username',
//       },
//     ];
//   }
// }
