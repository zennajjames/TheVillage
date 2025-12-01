import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const smsService = {
  async sendSMS(to: string, message: string) {
    console.log('📱 [SMS Service] Attempting to send SMS');
    console.log('📱 [SMS Service] To:', to);
    console.log('📱 [SMS Service] Message:', message);
    console.log('📱 [SMS Service] Twilio configured:', !!client);
    console.log('📱 [SMS Service] From number:', fromPhone);

    if (!client || !fromPhone) {
      console.log('⚠️  [SMS Service] SMS not configured, skipping send');
      console.log('⚠️  [SMS Service] Would have sent:', { to, message });
      return null;
    }

    try {
      const result = await client.messages.create({
        body: message,
        from: fromPhone,
        to: to
      });
      console.log('✅ [SMS Service] SMS sent successfully!');
      console.log('✅ [SMS Service] Twilio SID:', result.sid);
      console.log('✅ [SMS Service] Status:', result.status);
      return result;
    } catch (error) {
      console.error('❌ [SMS Service] Error sending SMS:', error);
      console.error('❌ [SMS Service] Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async sendNewMessageNotification(
    toPhone: string,
    toName: string,
    fromName: string
  ) {
    console.log('💬 [SMS Service] Sending new message notification');
    console.log('💬 [SMS Service] To:', toName, '(', toPhone, ')');
    console.log('💬 [SMS Service] From:', fromName);
    
    const message = `Hi ${toName}! ${fromName} sent you a message on The Village. Check it out: ${process.env.CLIENT_URL}/messages`;
    return this.sendSMS(toPhone, message);
  },

  async sendNewPostNotification(
    toPhone: string,
    toName: string,
    postType: string,
    postTitle: string,
    posterName: string
  ) {
    console.log('📢 [SMS Service] Sending new post notification');
    console.log('📢 [SMS Service] To:', toName, '(', toPhone, ')');
    console.log('📢 [SMS Service] Post type:', postType);
    console.log('📢 [SMS Service] Post title:', postTitle);
    
    const emoji = postType === 'REQUEST' ? '🙋‍♀️' : '👍';
    const message = `${emoji} New ${postType.toLowerCase()} in your area, ${toName}!\n\n"${postTitle}"\n\nPosted by ${posterName} on The Village.\n\nView: ${process.env.CLIENT_URL}/posts`;
    return this.sendSMS(toPhone, message);
  },

};