# Database Seeding Instructions

## Overview

The seed script populates the database with 29 Minneapolis Public Schools as communities. This allows new users to immediately find and join their school community.

## Running the Seed Script

### Prerequisites

- PostgreSQL database running
- Database migrations completed
- Environment variables configured

### Steps

1. **Navigate to the server directory**

```bash
cd server
```

2. **Run the seed script**

```bash
npm run seed
```

The script will:
- Create a system user (if it doesn't exist)
- Create 29 Minneapolis Public Schools as communities
- Set the system user as an admin of each school
- Display progress as each school is created

### Expected Output

```
Starting seed...
System user created: system@thevillage.app
Creating Minneapolis Public Schools...
✓ Created: Anwatin Middle School
✓ Created: Anthony Middle School
✓ Created: Armatage K-8
...
✓ Created: Windom Elementary

✅ Successfully seeded 29 Minneapolis Public Schools

You can now search for schools by zip code:
- 55405, 55419, 55410, 55407, 55409, 55408, 55418, 55411, 55406, 55417, 55414, 55403, 55404, 55413
```

## Minneapolis Public Schools Included

The seed includes 29 schools across various Minneapolis neighborhoods:

### Elementary Schools (K-5)
- Bancroft Elementary
- Burroughs Elementary
- Kenny Elementary
- Lyndale Elementary
- Sullivan Elementary
- Whittier International Elementary
- Windom Elementary

### K-8 Schools
- Armatage K-8
- Barton Open School
- Cityview Performing Arts Magnet
- Folwell Dual Immersion
- Hale STEM School
- Hiawatha Leadership Academy
- Lake Harriet Community School
- Lucy Laney Community School
- Pratt Community School
- Sheridan STEAM School
- Waite Park Community School

### Middle Schools (6-8)
- Anwatin Middle School
- Anthony Middle School
- Franklin Middle School
- Northeast Middle School
- Sanford Middle School

### Montessori Schools
- Nokomis Montessori (K-6)
- Seward Montessori (K-8)

### High Schools (9-12)
- Edison High School
- Minneapolis Southwest High School
- Minneapolis South High School
- Washburn High School

## Zip Codes Covered

The seed data covers these Minneapolis zip codes:

- **55403** - Near North
- **55404** - South Minneapolis
- **55405** - South Minneapolis
- **55406** - Southeast/South Minneapolis
- **55407** - South Minneapolis
- **55408** - South Minneapolis
- **55409** - Southwest Minneapolis
- **55410** - Southwest Minneapolis
- **55411** - North Minneapolis
- **55413** - Northeast Minneapolis
- **55414** - Southeast Minneapolis
- **55417** - South Minneapolis
- **55418** - Northeast Minneapolis
- **55419** - Southwest Minneapolis

## User Flow After Seeding

1. **New User Signs Up**
   - Creates account with zip code

2. **First Login**
   - Dashboard checks if user is in any communities
   - If NO communities → Redirect to "Find Your School" page

3. **Find Your School Page**
   - User enters their zip code
   - System shows all schools in that zip code
   - User can join their school with one click

4. **After Joining**
   - User is redirected to their school's community page
   - Can explore groups, join classrooms, and connect with other families

## Customizing the Seed Data

To add more schools or modify existing ones, edit `/server/prisma/seed.ts`:

```typescript
const schools = [
  {
    name: 'Your School Name',
    description: 'School description',
    address: '123 Main St',
    city: 'Minneapolis',
    state: 'MN',
    zipCode: '55401',
    location: 'Downtown Minneapolis',
  },
  // ... more schools
];
```

Then run `npm run seed` again. The script uses `upsert`, so it won't create duplicates.

## Resetting the Database

If you need to start fresh:

```bash
# WARNING: This will delete all data
npm run migrate:reset

# Then run the seed again
npm run seed
```

## Troubleshooting

### Error: "System user already exists"
This is normal - the script uses `upsert` and will just skip creating the user if it exists.

### Error: "Database connection failed"
Check that:
- PostgreSQL is running
- DATABASE_URL in `.env` is correct
- Database exists

### Error: "Prisma Client not generated"
Run:
```bash
npm run prisma:generate
```

## Adding Schools for Other Districts

To add schools for a different district:

1. Copy `/server/prisma/seed.ts` to a new file (e.g., `seed-stpaul.ts`)
2. Replace the Minneapolis schools data with your district's schools
3. Update `package.json` to add a new script:
   ```json
   "seed:stpaul": "ts-node prisma/seed-stpaul.ts"
   ```
4. Run the new seed script

## Production Deployment

When deploying to production:

1. Run migrations first:
   ```bash
   npm run migrate:dev
   ```

2. Then run the seed:
   ```bash
   npm run seed
   ```

3. The seed script is idempotent and safe to run multiple times
