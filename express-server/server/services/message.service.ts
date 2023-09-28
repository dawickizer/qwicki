export const getMessages = async (): Promise<void> => {};

export const sendMessage = async (): Promise<void> => {};

export const checkUnviewedMessages = async (): Promise<void> => {};

export const markMessagesAsViewed = async (): Promise<void> => {};

// async sendMessage(req: any): Promise<Message | null> {
//     let message: Message = new Message();
//     const toUser: User | null = await this.userService.get(
//       req.body.message.to._id
//     );
//     const fromUser: User | null = await this.userService.get(
//       req.body.decodedJWT._id
//     );

//     if (toUser && fromUser) {
//       // Check message eligibility (could add blocked logic later)
//       if (toUser.id === fromUser.id) throw Error('You cannot message yourself');
//       if (!fromUser.friends.includes(toUser._id))
//         throw Error(
//           'You cannot send a message to someone that is not your friend'
//         );

//       // update message with 'to' and 'from' friends ids
//       message.to = toUser._id;
//       message.from = fromUser._id;

//       // handle message metadata
//       message.createdAt = new Date();
//       message.content = req.body.message.content;

//       // persist the message
//       message = await this.createMessageAndPopulate(message);

//       return message;
//     } else throw Error('User does not exist');
//   }

//   async createMessageAndPopulate(message: Message): Promise<Message> {
//     return (await Message.create(message)).populate([
//       {
//         path: 'from',
//         model: 'User',
//         select: 'username',
//       },
//       {
//         path: 'to',
//         model: 'User',
//         select: 'username',
//       },
//     ]);
//   }

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
