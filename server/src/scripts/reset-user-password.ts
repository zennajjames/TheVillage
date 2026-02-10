import bcrypt from 'bcrypt';
import { prisma } from '../config/database';

async function resetPassword() {
  const email = 'zennajjames@gmail.com';
  const newPassword = 'asdfg12!';

  try {
    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    console.log('✅ Password updated successfully for:', user.email);
    console.log('📧 Email:', email);
    console.log('🔑 New password:', newPassword);
  } catch (error) {
    console.error('❌ Failed to update password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
