import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Campus {
  name: string;
  description: string;
  grades: string;
  location?: string;
}

interface SplitCampusGroup {
  combinedName: string;
  campuses: Campus[];
}

// Split campus schools in Minneapolis Public Schools
const splitCampusGroups: SplitCampusGroup[] = [
  {
    combinedName: 'Lake Nokomis',
    campuses: [
      {
        name: 'Wenonah Elementary (K-1)',
        description: 'Wenonah campus serves grades K-1. Located at 5625 23rd Avenue South. Part of Lake Nokomis Elementary School.',
        grades: 'K-1',
        location: '5625 23rd Avenue South, Minneapolis'
      },
      {
        name: 'Keewaydin Elementary (2-5)',
        description: 'Keewaydin campus serves grades 2-5. Located at 5209 30th Avenue South. Part of Lake Nokomis Elementary School.',
        grades: '2-5',
        location: '5209 30th Avenue South, Minneapolis'
      }
    ]
  },
  {
    combinedName: 'Hiawatha',
    campuses: [
      {
        name: 'Hiawatha Elementary - Hiawatha Campus (K-2)',
        description: 'Hiawatha campus serves grades K-2. Located at 4201 42nd Avenue South. Part of Hiawatha Elementary School.',
        grades: 'K-2',
        location: '4201 42nd Avenue South, Minneapolis'
      },
      {
        name: 'Hiawatha Elementary - Howe Campus (3-5)',
        description: 'Howe campus serves grades 3-5. Located at 3733 43rd Avenue South. Part of Hiawatha Elementary School.',
        grades: '3-5',
        location: '3733 43rd Avenue South, Minneapolis'
      }
    ]
  },
  {
    combinedName: 'Lake Harriet',
    campuses: [
      {
        name: 'Lake Harriet Lower Campus (K-2)',
        description: 'Lower campus serves grades K-2. Located at 4030 Chowen Avenue South. Part of Lake Harriet Elementary School.',
        grades: 'K-2',
        location: '4030 Chowen Avenue South, Minneapolis'
      },
      {
        name: 'Lake Harriet Upper Campus (3-5)',
        description: 'Upper campus serves grades 3-5. Located at 4912 Vincent Avenue South. Part of Lake Harriet Elementary School.',
        grades: '3-5',
        location: '4912 Vincent Avenue South, Minneapolis'
      }
    ]
  }
];

async function runMigration() {
  console.log('Starting split campus group migration...\n');

  for (const split of splitCampusGroups) {
    console.log(`Processing: ${split.combinedName}`);

    // Find the combined group
    const combinedGroup = await prisma.group.findFirst({
      where: {
        name: {
          contains: split.combinedName,
          mode: 'insensitive'
        }
      },
      include: {
        members: true
      }
    });

    if (!combinedGroup) {
      console.log(`  ⚠️  Combined group "${split.combinedName}" not found, skipping...\n`);
      continue;
    }

    console.log(`  ✓ Found combined group: ${combinedGroup.name}`);
    console.log(`  Members to transfer: ${combinedGroup.members.length}`);

    // Create individual campus groups
    for (const campus of split.campuses) {
      // Check if campus group already exists
      const existingCampus = await prisma.group.findFirst({
        where: {
          name: campus.name
        }
      });

      if (existingCampus) {
        console.log(`  ⚠️  ${campus.name} already exists, skipping...`);
        continue;
      }

      // Create the new campus group
      const newGroup = await prisma.group.create({
        data: {
          name: campus.name,
          description: campus.description,
          category: combinedGroup.category,
          location: campus.location || combinedGroup.location,
          isPrivate: combinedGroup.isPrivate,
          createdById: combinedGroup.createdById
        }
      });

      console.log(`  ✓ Created: ${campus.name} (${campus.grades})`);

      // Transfer all members from combined group to both campus groups
      for (const member of combinedGroup.members) {
        await prisma.groupMember.create({
          data: {
            groupId: newGroup.id,
            userId: member.userId,
            role: member.role
          }
        }).catch(err => {
          // Ignore duplicate key errors
          if (!err.message.includes('Unique constraint')) {
            console.error(`    Error adding member: ${err.message}`);
          }
        });
      }

      console.log(`  ✓ Transferred ${combinedGroup.members.length} members to ${campus.name}`);
    }

    // Optional: Delete the combined group
    // Uncomment the following lines if you want to remove the combined group
    // await prisma.groupMember.deleteMany({
    //   where: { groupId: combinedGroup.id }
    // });
    // await prisma.group.delete({
    //   where: { id: combinedGroup.id }
    // });
    // console.log(`  ✓ Deleted combined group: ${combinedGroup.name}`);

    console.log(`  ℹ️  Note: Original group "${combinedGroup.name}" still exists. Delete manually if needed.\n`);
  }

  console.log('✅ Migration complete!');
}

runMigration()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
