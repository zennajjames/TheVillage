# The Village

> Find Your Community, Connected

A hyperlocal platform for neighborhoods and schools to organize, communicate, and support each other—built on mutual aid and genuine community connection.
Launching soon.

Deployed here: https://the-village-six.vercel.app/

## Table of Contents

- [Overview](#overview)
- [Purpose & Vision](#purpose--vision)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Internationalization](#internationalization)
- [Database Schema](#database-schema)

## Overview

The Village is a community platform that helps neighborhoods and schools build stronger, more connected communities. Whether you're a parent looking for carpool partners, a neighbor offering to help with groceries, or a PTA organizing a fundraiser—The Village gives your community a home. Members can create and join communities based on where they live or where their kids go to school, then coordinate activities, share resources, and support each other through mutual aid.

## Purpose & Vision

### Mission

The Village strengthens local communities through mutual aid and genuine connection. We empower neighbors, parents, and families to organize, coordinate, and support each other—because it takes a village.

### Core Principles

- **Mutual Aid**: Voluntary, reciprocal exchange of resources and services for mutual benefit
- **Reciprocity**: Give when you can, receive when you need—both are equally valuable
- **Equality**: Everyone is a community member helping each other as equals
- **Solidarity**: We help each other because we're in this together, not out of charity
- **Community-Led**: Members decide what their community needs and how to meet those needs

### Perfect For

- **Carpool Coordination**: Organize safe, reliable transportation with families you trust
- **Neighborhood Help**: Share tools, lend a hand with yard work, or check in on a neighbor
- **Classroom Supplies**: Share and coordinate materials to support teachers and students
- **Events & Activities**: Plan and organize community events, school field trips, and volunteer coordination
- **Childcare Swaps**: Help each other out with pickups, playdates, and emergency coverage
- **Family Support**: Meal trains, moving help, and showing up when families need it most

## Features

### 1. Communities (Neighborhoods & Schools)

- **Find Your Community**: Discover and join communities by zip code—whether it's your neighborhood or your child's school
- **Community Profiles**: View community information, member count, and group count
- **Location-Based**: Find communities near you by address or zip code
- **Public & Private**: Communities can be public (anyone can join) or private (approval required)
- **Role-Based Access**: ADMIN, MODERATOR, and MEMBER roles with different permissions

### 2. Groups

Within each community, create topic-based groups:

- **Neighborhood**: Block-level or street-level groups for hyperlocal coordination
- **School**: School-specific groups for parents and families
- **Playgroup**: Connect families with kids of similar ages
- **Activities**: Sports, arts, music, and after-school coordination
- **Special Needs**: Support groups for families with special needs children
- **Working Parents**: Coordinate around work schedules
- **General Discussion**: Open forum for community topics
- **Other**: Custom categories for specific needs

### 3. SubGroups

Within groups, create more specific spaces:

- **By Grade & Teacher**: Organize by grade level and teacher name for school groups
- **By Block or Street**: Hyperlocal neighborhood coordination
- **Activity-Specific**: Coordinate around specific shared activities or needs

### 4. Posts & Communication

- **Group Posts**: Share updates, questions, and information within groups
- **Rich Content**: Text posts with optional images
- **Comments**: Threaded discussions on posts
- **Real-Time Updates**: Stay informed about community activity

### 5. Direct Messaging

- **Private Messages**: One-on-one conversations with other community members
- **Conversation Threads**: Organized message history
- **Real-Time Chat**: Instant message delivery
- **SMS Integration**: Send messages via SMS (Twilio integration)

### 6. Notifications

- **Activity Alerts**: Get notified about posts, comments, and mentions
- **Message Notifications**: Alerts for new direct messages
- **Group Updates**: Stay informed about group activities
- **Customizable Settings**: Control which notifications you receive

### 7. User Profiles

- **Personal Information**: Name, bio, interests, profile picture
- **Location Information**: Address, city, state, zip code
- **Contact Details**: Email and phone (with privacy controls)
- **Password Management**: Secure password reset functionality

### 8. Privacy Controls

- **Contact Information Privacy**: Choose what to share with community members
  - Show/hide email address
  - Show/hide phone number
  - Show/hide physical address
- **Messaging Preferences**: Control who can send you direct messages
- **Data Protection**: Your data is never sold or shared with third parties

### 9. Search Functionality

- **Global Search**: Search across communities, groups, and users
- **Filter by Type**: Find exactly what you're looking for
- **Location Search**: Search communities by location
- **Category Search**: Find groups by category

### 10. Multi-Language Support

Full internationalization support for diverse communities:

- **English** (en)
- **Spanish** (es) - Espa&ntilde;ol
- **Somali** (so) - Soomaali
- **Hmong** (hmn) - Hmoob

All content, navigation, and UI elements are fully translated.

### 11. Friendship System

- **Send Friend Requests**: Connect with neighbors and other parents
- **Accept/Reject Requests**: Manage your friend connections
- **Friend Status**: Track pending, accepted, and declined requests
- **Friend Lists**: View and manage your connections

## Architecture

### Three-Tier Hierarchy

```
Communities (Neighborhoods & Schools)
  Groups (Neighborhood, School, Playgroup, Activities, etc.)
    SubGroups (By classroom, by block, by activity)
```

### User Flow

1. **Sign Up/Login**: Create an account or log in
2. **Find Your Community**: Search by zip code to find your neighborhood or school
3. **Explore Groups**: Join groups within your community
4. **Create/Join SubGroups**: Connect with specific classrooms, blocks, or interests
5. **Participate**: Post, comment, message, and coordinate with your community

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **Prisma ORM** - Database toolkit and ORM
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Authentication and authorization
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image hosting and management
- **Nodemailer** - Email service
- **Twilio** - SMS messaging service
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Frontend

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **i18next** - Internationalization framework
- **react-i18next** - React integration for i18next
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vite** - Build tool and development server

### Development Tools

- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking
- **Prisma CLI** - Database migrations and management
- **tsx** - TypeScript execution
- **nodemon** - Development server auto-restart

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account (for image uploads)
- Twilio account (for SMS messaging)
- Email service credentials (for email notifications)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd the-village
```

2. **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Set up environment variables**

Create a `.env` file in the `server` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/the_village"

# JWT Secret
JWT_SECRET="your-secure-jwt-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Twilio (SMS)
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Server
PORT=8000
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

4. **Set up the database**

```bash
cd server

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run migrate:dev

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

5. **Start the development servers**

```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend development server
cd client
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

## Project Structure

```
the-village/
  client/                        # Frontend application
    public/                      # Static assets
    src/
      components/                # React components
        auth/                    # Authentication components
        communities/             # Community components (FindYourCommunity, etc.)
        groups/                  # Group-related components
        layout/                  # Layout components (Header, Footer)
        posts/                   # Post components
      context/                   # React contexts
        AuthContext.tsx           # Authentication context
      i18n/                      # Internationalization
        config.ts                # i18n configuration
        locales/                 # Translation files
          en.json                # English
          es.json                # Spanish
          so.json                # Somali
          hmn.json               # Hmong
      pages/                     # Page components
        About.tsx
        BrowseCommunities.tsx
        Communities.tsx
        CommunityDetail.tsx
        Dashboard.tsx
        GroupDetail.tsx
        Groups.tsx
        Landing.tsx
        Login.tsx
        Messages.tsx
        Notifications.tsx
        Onboarding.tsx
        Privacy.tsx
        Profile.tsx
        Signup.tsx
      services/                  # API service layer
        api.ts                   # Axios configuration
        auth.service.ts
        communities.service.ts
        friendships.service.ts
        groups.service.ts
        messages.service.ts
        notifications.service.ts
        posts.service.ts
        search.service.ts
        subgroups.service.ts
        users.service.ts
      types/                     # TypeScript type definitions
        index.ts
      utils/                     # Utility functions
      App.tsx                    # Main App component
      main.tsx                   # Entry point
    index.html
    package.json
    tailwind.config.js
    tsconfig.json
    vite.config.ts

  server/                        # Backend application
    prisma/
      migrations/                # Database migrations
      schema.prisma              # Database schema
    src/
      controllers/               # Request handlers
        auth.controller.ts
        communities.controller.ts
        friendships.controller.ts
        groups.controller.ts
        messages.controller.ts
        notifications.controller.ts
        posts.controller.ts
        search.controller.ts
        subgroups.controller.ts
        users.controller.ts
      middleware/                 # Express middleware
        auth.middleware.ts
        upload.middleware.ts
      routes/                    # API routes
        auth.routes.ts
        communities.routes.ts
        friendships.routes.ts
        groups.routes.ts
        messages.routes.ts
        notifications.routes.ts
        posts.routes.ts
        search.routes.ts
        subgroups.routes.ts
        users.routes.ts
      services/                  # Business logic services
        cloudinary.service.ts
        email.service.ts
        sms.service.ts
      types/                     # TypeScript type definitions
        express.d.ts
      index.ts                   # Server entry point
    .env                         # Environment variables
    package.json
    tsconfig.json
```

## API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication

- `POST /auth/signup` - Create a new user account
- `POST /auth/login` - Login and receive JWT token
- `POST /auth/forgot-password` - Request password reset email
- `POST /auth/reset-password` - Reset password with token

#### Communities

- `GET /communities` - Get all communities (with membership status)
- `GET /communities/my-communities` - Get user's joined communities
- `GET /communities/:id` - Get community by ID (includes groups and members)
- `POST /communities` - Create a new community
- `PUT /communities/:id` - Update community details
- `DELETE /communities/:id` - Delete community
- `POST /communities/:id/join` - Join a community
- `POST /communities/:id/leave` - Leave a community
- `PUT /communities/:id/members/:memberId/role` - Update member role (admin only)
- `DELETE /communities/:id/members/:memberId` - Remove member (admin only)

#### Groups

- `GET /groups` - Get all groups (filterable by category and communityId)
- `GET /groups/my-groups` - Get user's joined groups
- `GET /groups/:id` - Get group by ID (includes posts and subgroups)
- `POST /groups` - Create a new group (requires communityId)
- `PUT /groups/:id` - Update group details
- `DELETE /groups/:id` - Delete group
- `POST /groups/:id/join` - Join a group
- `POST /groups/:id/leave` - Leave a group

#### SubGroups

- `GET /groups/:groupId/subgroups` - Get all subgroups for a group
- `GET /subgroups/:id` - Get subgroup by ID
- `POST /groups/:groupId/subgroups` - Create a new subgroup
- `PUT /subgroups/:id` - Update subgroup details
- `DELETE /subgroups/:id` - Delete subgroup
- `POST /subgroups/:id/join` - Join a subgroup
- `POST /subgroups/:id/leave` - Leave a subgroup

#### Posts

- `GET /groups/:groupId/posts` - Get all posts for a group
- `GET /posts/:id` - Get post by ID (includes comments)
- `POST /groups/:groupId/posts` - Create a new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/comments` - Add a comment to a post
- `DELETE /posts/:postId/comments/:commentId` - Delete a comment

#### Messages

- `GET /messages/conversations` - Get all user's conversations
- `GET /messages/:userId` - Get messages with a specific user
- `POST /messages` - Send a new message
- `PUT /messages/:id/read` - Mark message as read

#### Notifications

- `GET /notifications` - Get user's notifications
- `PUT /notifications/:id/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all notifications as read

#### Friendships

- `GET /friendships` - Get user's friendships
- `GET /friendships/pending` - Get pending friend requests
- `POST /friendships/request` - Send a friend request
- `PUT /friendships/:id/accept` - Accept a friend request
- `PUT /friendships/:id/reject` - Reject a friend request
- `DELETE /friendships/:id` - Remove a friendship

#### Users

- `GET /users/profile` - Get current user's profile
- `PUT /users/profile` - Update user profile
- `POST /users/profile-picture` - Upload profile picture
- `PUT /users/password` - Change password
- `PUT /users/privacy-settings` - Update privacy settings

#### Search

- `GET /search?q=query` - Search across communities, groups, and users

## Internationalization

The Village supports four languages out of the box. To add a new language:

1. Create a new JSON file in `client/src/i18n/locales/` (e.g., `fr.json`)
2. Copy the structure from `en.json` and translate all strings
3. Update `client/src/i18n/config.ts` to include the new language:

```typescript
resources: {
  en: { translation: en },
  es: { translation: es },
  so: { translation: so },
  hmn: { translation: hmn },
  fr: { translation: fr }, // Add new language
}
```

4. Add a language selector option in your UI components

### Using Translations in Components

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t('nav.home')}</h1>;
}
```

## Database Schema

### Core Models

#### User
- Authentication and profile information
- Privacy settings
- Relationships: Communities, Groups, SubGroups, Posts, Messages, Friendships

#### Community (Neighborhood or School)
- Community information and settings
- Location data (address, zip code)
- Relationships: Members (CommunityMember), Groups

#### Group
- Group information within a community
- Category classification (Neighborhood, School, Playgroup, Activities, etc.)
- Relationships: Community, Members (GroupMember), Posts, SubGroups

#### SubGroup
- Specific sub-spaces within a group (classrooms, blocks, etc.)
- Optional teacher and grade details for school groups
- Relationships: Group, Members (SubGroupMember)

#### Post
- Content shared within groups
- Comments and engagement
- Relationships: Group, Author (User), Comments

#### Message
- Direct messages between users
- Read/unread status
- Relationships: Sender (User), Recipient (User)

#### Notification
- User activity notifications
- Notification types and status
- Relationships: User

#### Friendship
- Friend connections between users
- Request status (PENDING, ACCEPTED, REJECTED)
- Relationships: Requester (User), Recipient (User)

### Role Types

- **ADMIN**: Full control over community/group
- **MODERATOR**: Can moderate content and manage members
- **MEMBER**: Standard member access

### Friendship Status

- **PENDING**: Friend request sent, awaiting response
- **ACCEPTED**: Friendship established
- **REJECTED**: Friend request declined

## Development

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Database Migrations

```bash
cd server

# Create a new migration
npm run migrate:dev

# Reset database (WARNING: Deletes all data)
npm run migrate:reset

# Open Prisma Studio
npm run prisma:studio
```

### Building for Production

```bash
# Build backend
cd server
npm run build

# Build frontend
cd client
npm run build
```

## Contributing

This is a community-driven project. Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[License information to be added]

## Contact & Support

For questions, issues, or feedback, please open an issue on GitHub.

---

**Built with love for communities everywhere**
