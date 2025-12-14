import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create a system user to be the creator of communities
  const hashedPassword = await bcrypt.hash('systemuser123', 10);

  const systemUser = await prisma.user.upsert({
    where: { email: 'system@thevillage.app' },
    update: {},
    create: {
      email: 'system@thevillage.app',
      passwordHash: hashedPassword,
      firstName: 'System',
      lastName: 'User',
      location: 'Minneapolis',
      zipCode: '55401',
      city: 'Minneapolis',
      state: 'MN',
      isAdmin: true,
      isVerified: true,
    },
  });

  console.log('System user created:', systemUser.email);

  // Minneapolis Public Schools data
  const minneapolisSchools = [
    {
      name: 'Anwatin Middle School',
      description: 'Anwatin Middle School serves grades 6-8 in South Minneapolis, focusing on personalized learning and community engagement.',
      address: '256 Upton Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55405',
      location: 'South Minneapolis',
    },
    {
      name: 'Anthony Middle School',
      description: 'Anthony Middle School provides a comprehensive education for grades 6-8 with a focus on academic excellence and student development.',
      address: '5757 Irving Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55419',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Armatage K-8',
      description: 'Armatage serves students from kindergarten through 8th grade, offering a supportive learning environment in Southwest Minneapolis.',
      address: '2501 W 57th St',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55410',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Bancroft Elementary',
      description: 'Bancroft Elementary serves students in grades K-5 with a focus on community involvement and academic achievement.',
      address: '1315 E 38th St',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55407',
      location: 'South Minneapolis',
    },
    {
      name: 'Barton Open School',
      description: 'Barton Open School offers a progressive, experiential learning environment for students in grades K-8.',
      address: '4237 Colfax Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55409',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Burroughs Elementary',
      description: 'Burroughs Elementary provides quality education for K-5 students with a strong emphasis on literacy and STEM.',
      address: '1601 W 50th St',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55419',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Cityview Performing Arts Magnet',
      description: 'Cityview integrates performing arts into a comprehensive K-8 education, nurturing creativity and academic excellence.',
      address: '3350 4th Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55408',
      location: 'South Minneapolis',
    },
    {
      name: 'Edison High School',
      description: 'Edison High School serves grades 9-12, offering diverse academic programs and extracurricular activities.',
      address: '700 22nd Ave NE',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55418',
      location: 'Northeast Minneapolis',
    },
    {
      name: 'Field Elementary - Lower Campus',
      description: 'Field Elementary Lower Campus serves K-2 students with a focus on individualized learning and community engagement.',
      address: '4645 4th Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55419',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Field Elementary - Upper Campus',
      description: 'Field Elementary Upper Campus serves grades 3-5 with a focus on individualized learning and community engagement.',
      address: '4655 4th Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55419',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Folwell Dual Immersion',
      description: 'Folwell offers a dual language immersion program for K-8 students in Spanish and English.',
      address: '3611 20th Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55407',
      location: 'South Minneapolis',
    },
    {
      name: 'Franklin Middle School',
      description: 'Franklin Middle School provides comprehensive education for grades 6-8 with a focus on college and career readiness.',
      address: '1501 Aldrich Ave N',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55411',
      location: 'North Minneapolis',
    },
    {
      name: 'Hale STEM School - Lower Campus',
      description: 'Hale STEM School Lower Campus focuses on science, technology, engineering, and math for students in grades K-2.',
      address: '4959 Green Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55410',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Hale STEM School - Upper Campus',
      description: 'Hale STEM School Upper Campus focuses on science, technology, engineering, and math for students in grades 3-8.',
      address: '4901 Green Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55410',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Hiawatha Leadership Academy',
      description: 'Hiawatha Leadership Academy serves grades K-8 with a focus on leadership development and academic excellence.',
      address: '4305 42nd Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55406',
      location: 'South Minneapolis',
    },
    {
      name: 'Kenny Elementary',
      description: 'Kenny Elementary provides a nurturing environment for K-5 students with strong community partnerships.',
      address: '5720 Emerson Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55419',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Lake Harriet - Lower Campus',
      description: 'Lake Harriet Lower Campus serves K-3 students with a community-focused approach to education in Southwest Minneapolis.',
      address: '4912 Vincent Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55410',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Lake Harriet - Upper Campus',
      description: 'Lake Harriet Upper Campus serves grades 4-8 with a community-focused approach to education in Southwest Minneapolis.',
      address: '4944 Chowen Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55410',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Lucy Laney Community School',
      description: 'Lucy Laney serves K-8 students with a focus on cultural responsiveness and academic achievement.',
      address: '1201 Yale Pl',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55403',
      location: 'Near North Minneapolis',
    },
    {
      name: 'Lyndale Elementary',
      description: 'Lyndale Elementary provides quality K-5 education with a focus on literacy and community engagement.',
      address: '312 W 50th St',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55419',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Minneapolis Southwest High School',
      description: 'Southwest High School offers comprehensive 9-12 education with diverse academic and extracurricular programs.',
      address: '3414 W 47th St',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55410',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Minneapolis South High School',
      description: 'South High School serves grades 9-12 with a rich tradition of academic excellence and community involvement.',
      address: '3131 19th Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55407',
      location: 'South Minneapolis',
    },
    {
      name: 'Nokomis Montessori',
      description: 'Nokomis Montessori offers Montessori education for students in grades K-6.',
      address: '5040 Chicago Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55417',
      location: 'South Minneapolis',
    },
    {
      name: 'Lake Nokomis - Wenonah',
      description: 'Lake Nokomis Wenonah Elementary serves K-1 students in the Nokomis neighborhood with a focus on community and academic excellence.',
      address: '5625 30th Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55417',
      location: 'South Minneapolis',
    },
    {
      name: 'Lake Nokomis - Keewaydin',
      description: 'Lake Nokomis Keewaydin Elementary provides 2-5 education with a strong emphasis on student growth and community engagement.',
      address: '5209 30th Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55417',
      location: 'South Minneapolis',
    },
    {
      name: 'Northeast Middle School',
      description: 'Northeast Middle School serves grades 6-8 with a focus on preparing students for high school success.',
      address: '2955 Hayes St NE',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55418',
      location: 'Northeast Minneapolis',
    },
    {
      name: 'Pratt Community School',
      description: 'Pratt serves K-8 students with a strong emphasis on community partnerships and student achievement.',
      address: '66 Malcolm Ave SE',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55414',
      location: 'Southeast Minneapolis',
    },
    {
      name: 'Sanford Middle School',
      description: 'Sanford Middle School provides comprehensive education for grades 6-8 with a focus on student success.',
      address: '3524 42nd Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55406',
      location: 'South Minneapolis',
    },
    {
      name: 'Seward Montessori',
      description: 'Seward Montessori offers Montessori education for students in grades K-8 in Southeast Minneapolis.',
      address: '2309 28th Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55406',
      location: 'Southeast Minneapolis',
    },
    {
      name: 'Sheridan STEAM School',
      description: 'Sheridan focuses on Science, Technology, Engineering, Arts, and Math for K-8 students.',
      address: '1201 NE Broadway St',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55413',
      location: 'Northeast Minneapolis',
    },
    {
      name: 'Sullivan Elementary',
      description: 'Sullivan Elementary serves K-5 students with a focus on academic excellence and character development.',
      address: '1821 E 48th St',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55417',
      location: 'South Minneapolis',
    },
    {
      name: 'Washburn High School',
      description: 'Washburn High School serves grades 9-12 with strong academic programs and community connections.',
      address: '201 W 49th St',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55419',
      location: 'Southwest Minneapolis',
    },
    {
      name: 'Waite Park Community School',
      description: 'Waite Park serves K-8 students with a focus on community engagement and academic growth.',
      address: '1701 N Bryant Ave',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55411',
      location: 'North Minneapolis',
    },
    {
      name: 'Whittier International Elementary',
      description: 'Whittier offers an international baccalaureate program for K-5 students.',
      address: '315 W 26th St',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55404',
      location: 'South Minneapolis',
    },
    {
      name: 'Windom Elementary',
      description: 'Windom Elementary serves K-5 students with a focus on literacy and community partnerships.',
      address: '5821 Wentworth Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55419',
      location: 'Southwest Minneapolis',
    },
  ];

  console.log('Creating Minneapolis Public Schools...');

  let createdCount = 0;
  for (const school of minneapolisSchools) {
    const community = await prisma.community.upsert({
      where: {
        name_zipCode: {
          name: school.name,
          zipCode: school.zipCode,
        },
      },
      update: {
        description: school.description,
        address: school.address,
        location: school.location,
      },
      create: {
        name: school.name,
        description: school.description,
        address: school.address,
        location: school.location,
        zipCode: school.zipCode,
        isPrivate: false,
        createdById: systemUser.id,
      },
    });

    // Create system user as admin of the community
    await prisma.communityMember.upsert({
      where: {
        communityId_userId: {
          communityId: community.id,
          userId: systemUser.id,
        },
      },
      update: {},
      create: {
        communityId: community.id,
        userId: systemUser.id,
        role: 'ADMIN',
      },
    });

    createdCount++;
    console.log(`✓ Created: ${school.name}`);
  }

  console.log(`\n✅ Successfully seeded ${createdCount} Minneapolis Public Schools`);
  console.log(`\nYou can now search for schools by zip code:`);
  console.log(`- 55405, 55419, 55410, 55407, 55409, 55408, 55418, 55411, 55406, 55417, 55414, 55403, 55404, 55413`);
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
