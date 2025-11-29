import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const minneapolisElementarySchools = [
  { name: 'Anwatin Middle School', location: 'Minneapolis, MN', zipCode: '55411' },
  { name: 'Anthony Middle School', location: 'Minneapolis, MN', zipCode: '55406' },
  { name: 'Armatage Neighborhood School', location: 'Minneapolis, MN', zipCode: '55410' },
  { name: 'Bancroft Elementary', location: 'Minneapolis, MN', zipCode: '55408' },
  { name: 'Barton Open School', location: 'Minneapolis, MN', zipCode: '55409' },
  { name: 'Burroughs Community School', location: 'Minneapolis, MN', zipCode: '55411' },
  { name: 'Cityview Community School', location: 'Minneapolis, MN', zipCode: '55411' },
  { name: 'Downtown Open School', location: 'Minneapolis, MN', zipCode: '55403' },
  { name: 'Dowling Elementary', location: 'Minneapolis, MN', zipCode: '55411' },
  { name: 'Emerson Spanish Immersion', location: 'Minneapolis, MN', zipCode: '55407' },
  { name: 'Folwell Performing Arts', location: 'Minneapolis, MN', zipCode: '55411' },
  { name: 'Green Central Park School', location: 'Minneapolis, MN', zipCode: '55404' },
  { name: 'Hale STEM School', location: 'Minneapolis, MN', zipCode: '55417' },
  { name: 'Howe Elementary', location: 'Minneapolis, MN', zipCode: '55407' },
  { name: 'Jenny Lind Elementary', location: 'Minneapolis, MN', zipCode: '55411' },
  { name: 'Kenwood Elementary', location: 'Minneapolis, MN', zipCode: '55403' },
  { name: 'Lake Harriet Community School', location: 'Minneapolis, MN', zipCode: '55419' },
  { name: 'Lake Nokomis Community School', location: 'Minneapolis, MN', zipCode: '55417' },
  { name: 'Loring Elementary', location: 'Minneapolis, MN', zipCode: '55403' },
  { name: 'Lyndale Community School', location: 'Minneapolis, MN', zipCode: '55408' },
  { name: 'Marcy Open School', location: 'Minneapolis, MN', zipCode: '55413' },
  { name: 'Minneapolis Kids School', location: 'Minneapolis, MN', zipCode: '55406' },
  { name: 'Minnehaha Academy Lower School', location: 'Minneapolis, MN', zipCode: '55406' },
  { name: 'Morris Park Elementary', location: 'Minneapolis, MN', zipCode: '55111' },
  { name: 'Nellie Stone Johnson Community School', location: 'Minneapolis, MN', zipCode: '55411' },
  { name: 'Northeast Middle School', location: 'Minneapolis, MN', zipCode: '55418' },
  { name: 'Northrop Elementary', location: 'Minneapolis, MN', zipCode: '55419' },
  { name: 'Pillsbury Elementary', location: 'Minneapolis, MN', zipCode: '55408' },
  { name: 'Pratt Community School', location: 'Minneapolis, MN', zipCode: '55407' },
  { name: 'Sanford Middle School', location: 'Minneapolis, MN', zipCode: '55408' },
  { name: 'Seward Montessori', location: 'Minneapolis, MN', zipCode: '55414' },
  { name: 'Sheridan STEM School', location: 'Minneapolis, MN', zipCode: '55411' },
  { name: 'Sullivan Elementary', location: 'Minneapolis, MN', zipCode: '55418' },
  { name: 'Waite Park Community School', location: 'Minneapolis, MN', zipCode: '55417' },
  { name: 'Washburn Elementary', location: 'Minneapolis, MN', zipCode: '55410' },
  { name: 'Webber Park Elementary', location: 'Minneapolis, MN', zipCode: '55411' },
  { name: 'Whittier International Elementary', location: 'Minneapolis, MN', zipCode: '55408' },
  { name: 'Windom Elementary', location: 'Minneapolis, MN', zipCode: '55417' }
];

async function seedSchoolGroups() {
  console.log('Starting to seed Minneapolis elementary school groups...');

  // First, find a user to be the admin (you can use your own user ID)
  const adminUser = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' }
  });

  if (!adminUser) {
    console.error('No users found in database. Please create a user first.');
    return;
  }

  console.log(`Using user ${adminUser.firstName} ${adminUser.lastName} as admin`);

  for (const school of minneapolisElementarySchools) {
    try {
      // Check if group already exists
      const existingGroup = await prisma.group.findFirst({
        where: { name: school.name }
      });

      if (existingGroup) {
        console.log(`Group "${school.name}" already exists, skipping...`);
        continue;
      }

      // Create the group
      const group = await prisma.group.create({
        data: {
          name: school.name,
          description: `A community group for families at ${school.name}. Connect with other parents, share resources, organize playdates, and stay informed about school activities and events.`,
          location: school.location,
          category: 'School',
          isPrivate: false,
          createdById: adminUser.id,
          members: {
            create: {
              userId: adminUser.id,
              role: 'ADMIN'
            }
          }
        }
      });

      console.log(`✓ Created group: ${school.name}`);
    } catch (error) {
      console.error(`Error creating group ${school.name}:`, error);
    }
  }

  console.log('\n✅ Finished seeding school groups!');
}

seedSchoolGroups()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });