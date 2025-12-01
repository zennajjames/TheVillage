import { prisma } from '../config/database';
import { smsService } from './sms.service';

export type NotificationType = 
  | 'NEW_MESSAGE'
  | 'NEW_POST'
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPTED'
  | 'GROUP_POST'
  | 'GROUP_INVITE'
  | 'POST_RESPONSE'
  | 'SYSTEM';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  relatedUserId?: string;
  relatedPostId?: string;
  relatedGroupId?: string;
  relatedMessageId?: string;
}

export const notificationService = {
  async createNotification(params: CreateNotificationParams) {
    try {
      const notification = await prisma.notification.create({
        data: params
      });

      // Get user preferences
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
        select: {
          firstName: true,
          phoneNumber: true,
          phoneVerified: true,
          smsNotifications: true,
          notifyViaSMS: true
        }
      });

      // Send SMS if user has it enabled
      if (user && user.phoneNumber && user.phoneVerified && user.smsNotifications && user.notifyViaSMS) {
        try {
          await smsService.sendSMS(
            user.phoneNumber,
            `${params.title}\n${params.message}\n\nView: ${process.env.CLIENT_URL}${params.actionUrl || ''}`
          );
        } catch (error) {
          console.error('Failed to send SMS notification:', error);
        }
      }

      return notification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  },

  async notifyNewMessage(
    recipientId: string,
    senderId: string,
    senderName: string,
    messagePreview: string,
    conversationId: string
  ) {
    return this.createNotification({
      userId: recipientId,
      type: 'NEW_MESSAGE',
      title: 'New Message',
      message: `${senderName} sent you a message: "${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}"`,
      actionUrl: `/messages/${conversationId}`,
      relatedUserId: senderId
    });
  },

  async notifyNewPost(
    userId: string,
    postId: string,
    postType: string,
    postTitle: string,
    posterName: string,
    location: string
  ) {
    const emoji = postType === 'REQUEST' ? '🙋‍♀️' : '👍';
    return this.createNotification({
      userId,
      type: 'NEW_POST',
      title: `${emoji} New ${postType} in Your Area`,
      message: `${posterName} posted "${postTitle}" in ${location}`,
      actionUrl: `/posts/${postId}`,
      relatedPostId: postId
    });
  },

  async notifyFriendRequest(
    recipientId: string,
    requesterId: string,
    requesterName: string
  ) {
    return this.createNotification({
      userId: recipientId,
      type: 'FRIEND_REQUEST',
      title: 'Friend Request',
      message: `${requesterName} sent you a friend request`,
      actionUrl: '/friends',
      relatedUserId: requesterId
    });
  },

  async notifyFriendAccepted(
    userId: string,
    accepterId: string,
    accepterName: string
  ) {
    return this.createNotification({
      userId,
      type: 'FRIEND_ACCEPTED',
      title: 'Friend Request Accepted',
      message: `${accepterName} accepted your friend request`,
      actionUrl: `/profile/${accepterId}`,
      relatedUserId: accepterId
    });
  },

  async notifyGroupPost(
    userId: string,
    groupId: string,
    groupName: string,
    posterName: string,
    contentPreview: string
  ) {
    return this.createNotification({
      userId,
      type: 'GROUP_POST',
      title: `New Post in ${groupName}`,
      message: `${posterName} posted: "${contentPreview.substring(0, 50)}${contentPreview.length > 50 ? '...' : ''}"`,
      actionUrl: `/groups/${groupId}`,
      relatedGroupId: groupId
    });
  },

  async notifyGroupInvite(
    userId: string,
    groupId: string,
    groupName: string,
    inviterName: string
  ) {
    return this.createNotification({
      userId,
      type: 'GROUP_INVITE',
      title: 'Group Invitation',
      message: `${inviterName} invited you to join ${groupName}`,
      actionUrl: `/groups/${groupId}`,
      relatedGroupId: groupId
    });
  },

  async getNotifications(userId: string, limit = 50) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  },

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        read: false
      }
    });
  },

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.update({
      where: {
        id: notificationId,
        userId // Ensure user owns the notification
      },
      data: { read: true }
    });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        read: false
      },
      data: { read: true }
    });
  },

  async deleteNotification(notificationId: string, userId: string) {
    return prisma.notification.delete({
      where: {
        id: notificationId,
        userId
      }
    });
  },

  async deleteAllRead(userId: string) {
    return prisma.notification.deleteMany({
      where: {
        userId,
        read: true
      }
    });
  }
};
