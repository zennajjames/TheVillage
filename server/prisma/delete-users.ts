import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting user deletion...');

  try {
    // Delete all users (cascading deletes will handle related records)
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        isAdmin: false // Keep admin users if any
      }
    });

    console.log(`✅ Deleted ${deletedUsers.count} non-admin users`);

    // If you want to delete ALL users including admins, uncomment below:
    // const allDeleted = await prisma.user.deleteMany({});
    // console.log(`✅ Deleted ${allDeleted.count} total users (including admins)`);

  } catch (error) {
    console.error('Error deleting users:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Delete users failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
