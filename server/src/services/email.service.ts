import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const emailService = {
  async sendNewMessageNotification(
    toEmail: string,
    toName: string,
    fromName: string,
    messagePreview: string,
    conversationId: string
  ) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject: `New message from ${fromName} - The Village`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #9333ea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .message-preview { background-color: white; padding: 15px; border-left: 4px solid #9333ea; margin: 20px 0; }
                .button { display: inline-block; background-color: #9333ea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>💬 New Message</h1>
                </div>
                <div class="content">
                  <p>Hi ${toName},</p>
                  <p><strong>${fromName}</strong> sent you a message:</p>
                  <div class="message-preview">
                    "${messagePreview}"
                  </div>
                  <a href="${process.env.CLIENT_URL}/messages/${conversationId}" class="button">
                    View Message
                  </a>
                  <p style="margin-top: 20px;">Stay connected with your community!</p>
                </div>
                <div class="footer">
                  <p>You're receiving this because you're a member of The Village.</p>
                  <p>To manage your notification preferences, visit your profile settings.</p>
                </div>
              </div>
            </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  },

  async sendNewPostNotification(
    toEmail: string,
    toName: string,
    postType: string,
    postTitle: string,
    postDescription: string,
    posterName: string,
    location: string,
    postId: string
  ) {
    try {
      const emoji = postType === 'REQUEST' ? '🙋‍♀️' : '💝';
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject: `New ${postType.toLowerCase()} in your area - The Village`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #9333ea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .post-card { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e5e5; }
                .post-type { display: inline-block; background-color: ${postType === 'REQUEST' ? '#f3e8ff' : '#dcfce7'}; color: ${postType === 'REQUEST' ? '#7e22ce' : '#15803d'}; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; }
                .button { display: inline-block; background-color: #9333ea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>${emoji} New Post in Your Community</h1>
                </div>
                <div class="content">
                  <p>Hi ${toName},</p>
                  <p>There's a new ${postType.toLowerCase()} near you:</p>
                  <div class="post-card">
                    <span class="post-type">${emoji} ${postType}</span>
                    <h2 style="margin: 15px 0 10px 0;">${postTitle}</h2>
                    <p style="color: #666; margin-bottom: 10px;">${postDescription}</p>
                    <p style="font-size: 14px; color: #888;">📍 ${location}</p>
                    <p style="font-size: 14px; color: #888;">Posted by ${posterName}</p>
                  </div>
                  <a href="${process.env.CLIENT_URL}/posts/${postId}" class="button">
                    View Post
                  </a>
                  <p style="margin-top: 20px;">Help your neighbors or get the help you need!</p>
                </div>
                <div class="footer">
                  <p>You're receiving this because you're a member of The Village.</p>
                  <p>To manage your notification preferences, visit your profile settings.</p>
                </div>
              </div>
            </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Post notification sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  },

  async sendGroupPostNotification(
    toEmail: string,
    toName: string,
    groupName: string,
    posterName: string,
    postContent: string,
    groupId: string
  ) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject: `New post in ${groupName} - The Village`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #9333ea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .post-preview { background-color: white; padding: 15px; border-left: 4px solid #9333ea; margin: 20px 0; }
                .button { display: inline-block; background-color: #9333ea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>👥 New Group Post</h1>
                </div>
                <div class="content">
                  <p>Hi ${toName},</p>
                  <p><strong>${posterName}</strong> posted in <strong>${groupName}</strong>:</p>
                  <div class="post-preview">
                    ${postContent.substring(0, 200)}${postContent.length > 200 ? '...' : ''}
                  </div>
                  <a href="${process.env.CLIENT_URL}/groups/${groupId}" class="button">
                    View Group
                  </a>
                </div>
                <div class="footer">
                  <p>You're receiving this because you're a member of The Village.</p>
                  <p>To manage your notification preferences, visit your profile settings.</p>
                </div>
              </div>
            </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Group notification sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
};