import { Schema } from 'mongoose';
import { Invite } from '../models/invite';
import { User } from '../models/user';
import * as userService from './user.service';
import BadRequestError from '../error/BadRequestError';
import NotFoundError from '../error/NotFoundError';

export const getInviteById = async (
  inviteId: string | Schema.Types.ObjectId
): Promise<Invite> => {
  const invite = await Invite.findById(inviteId);
  if (!invite) throw new NotFoundError(`Invite not found. ID: ${inviteId}`);
  return invite;
};

export const getInvitesByUserId = async (
  userId: string | Schema.Types.ObjectId,
  params?: { inbound?: boolean; outbound?: boolean }
): Promise<Invite[]> => {
  let queryConditions = [];

  if (params?.inbound) {
    queryConditions.push({ to: userId });
  }
  if (params?.outbound) {
    queryConditions.push({ from: userId });
  }
  if (!params?.inbound && !params?.outbound) {
    queryConditions = [{ from: userId }, { to: userId }];
  }

  return await Invite.find({ $or: queryConditions })
    .populate('from', 'username')
    .populate('to', 'username');
};

export const createInvite = async (
  userId: string | Schema.Types.ObjectId,
  invite: Invite
): Promise<Invite> => {
  // Retrieve both users in parallel.
  const [toUser, fromUser] = await Promise.all([
    userService.getUserById(invite.to),
    userService.getUserById(userId),
  ]);

  // Ensure users are not the same
  if (toUser._id.equals(fromUser._id))
    throw new BadRequestError('You cannot send an invite to yourself');

  // Ensure users are friends
  if (
    !toUser.friends.includes(fromUser._id) ||
    !fromUser.friends.includes(toUser._id)
  )
    throw new BadRequestError(
      'You must be friends with the person you are trying to invite'
    );

  // Ensure there is no existing invite between the users
  const existingRequest = await Invite.findOne({
    $or: [
      { from: fromUser._id, to: toUser._id },
      { from: toUser._id, to: fromUser._id },
    ],
  });

  if (existingRequest)
    throw new BadRequestError('There is already an invite between these users');

  // Create the invite
  const createdInvite = await Invite.create({
    from: fromUser._id,
    to: toUser._id,
    type: invite.type,
    roomId: invite.roomId,
    metadata: invite.metadata,
  });

  // Update users' invite arrays
  await Promise.all([
    userService.addOutboundInvite(fromUser._id, createdInvite._id),
    userService.addInboundInvite(toUser._id, createdInvite._id),
  ]);

  return createdInvite.populate([
    { path: 'to', select: 'username' },
    { path: 'from', select: 'username' },
  ]);
};

export const deleteInviteById = async (
  userId: string | Schema.Types.ObjectId,
  inviteId: string | Schema.Types.ObjectId
): Promise<User> => {
  const invite = await getInviteById(inviteId);

  if (!invite) throw new NotFoundError('Invite not found');

  // removing inviteId from inbound and outbound invites of both users
  await Promise.all([
    userService.removeInboundInvite(
      invite.from,
      inviteId as Schema.Types.ObjectId
    ),
    userService.removeOutboundInvite(
      invite.from,
      inviteId as Schema.Types.ObjectId
    ),
    userService.removeInboundInvite(
      invite.to,
      inviteId as Schema.Types.ObjectId
    ),
    userService.removeOutboundInvite(
      invite.to,
      inviteId as Schema.Types.ObjectId
    ),
  ]);

  await Invite.findByIdAndDelete(inviteId);

  return await invite.populate([
    { path: 'to', select: 'username' },
    { path: 'from', select: 'username' },
  ]);
};

export const deleteManyInvitesByUserId = async (
  userId: string | Schema.Types.ObjectId
): Promise<boolean> => {
  await Invite.deleteMany({ $or: [{ from: userId }, { to: userId }] });
  return true;
};
