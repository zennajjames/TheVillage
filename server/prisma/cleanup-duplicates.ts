import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  console.log('Starting cleanup of duplicate communities...');

  // Delete all communities that are NOT created by the system user
  const systemUser = await prisma.user.findUnique({
    where: { email: 'system@thevillage.app' },
  });

  if (!systemUser) {
    console.log('System user not found. Cannot proceed with cleanup.');
    return;
  }

  // Get all communities
  const allCommunities = await prisma.community.findMany({
    include: {
      _count: {
        select: { members: true },
      },
    },
  });

  console.log(`Found ${allCommunities.length} total communities`);

  // Group by name to find duplicates
  const grouped = new Map<string, any[]>();

  for (const community of allCommunities) {
    const key = `${community.name}-${community.zipCode}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(community);
  }

  // For each group, keep only the oldest one (by createdAt)
  let deletedCount = 0;
  for (const [key, communities] of grouped.entries()) {
    if (communities.length > 1) {
      console.log(`Found ${communities.length} duplicates of: ${key}`);

      // Sort by createdAt, keep the oldest
      communities.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      const toKeep = communities[0];
      const toDelete = communities.slice(1);

      console.log(`  Keeping: ${toKeep.id} (created ${toKeep.createdAt})`);

      for (const duplicate of toDelete) {
        console.log(`  Deleting: ${duplicate.id} (created ${duplicate.createdAt})`);
        await prisma.community.delete({
          where: { id: duplicate.id },
        });
        deletedCount++;
      }
    }
  }

  console.log(`\n✅ Cleanup complete!`);
  console.log(`Total communities before: ${allCommunities.length}`);
  console.log(`Duplicates deleted: ${deletedCount}`);
  console.log(`Total communities after: ${allCommunities.length - deletedCount}`);
}

cleanup()
  .catch((e) => {
    console.error('Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
