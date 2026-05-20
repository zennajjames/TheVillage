# The Village

> It Takes a Village to Raise a Child.

A hyperlocal platform for parents and caregivers to connect, coordinate, and support each other — because no one should have to do this alone.

🌐 **Live:** https://the-village-six.vercel.app/

---

> **Personal Project** — Built by Zenna James with help from [Claude Code](https://claude.ai/code) (Anthropic's AI coding assistant). This is a passion project, not a commercial product.

---

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

The Village is a community platform built specifically for parents and caregivers of children. Whether you're looking for carpool partners, coordinating classroom volunteers, swapping childcare hours, or just need a trusted parent nearby to lean on — The Village gives your parent community a home.

Members join communities based on their school or neighborhood, then coordinate activities, share resources, and support each other through mutual aid.

## Purpose & Vision

### Mission

The Village connects parents and caregivers so they can support each other as equals — because raising children is better together, and it truly takes a village.

### Core Principles

- **Mutual Aid**: Voluntary, reciprocal exchange of resources and support for shared benefit
- **Reciprocity**: Give when you can, receive when you need — both are equally valuable
- **Equality**: Every parent and caregiver is an equal member of the community
- **Solidarity**: We help each other because we're in this together, not out of charity
- **Parent-Led**: Members decide what their community needs and how to meet those needs

### Perfect For

- **Carpool Coordination**: Organize safe, reliable transportation with families you trust
- **Classroom Supplies**: Share and coordinate materials to support teachers and students
- **Events & Activities**: Plan school events, field trips, and community gatherings
- **Childcare Swaps**: Trade babysitting hours with trusted families from your community
- **Family Support**: Meal trains, moving help, and showing up when families need it most
- **Room Parents**: Coordinate class events and keep parents informed

## Features

### 1. Communities (Neighborhoods & Schools)

- **Find Your Community**: Discover and join communities by zip code — your neighborhood or your child's school
- **Community Profiles**: View community information, member count, and activity
- **Location-Based**: Find communities near you by address or zip code
- **Public & Private**: Communities can be open or approval-required
- **Role-Based Access**: ADMIN, MODERATOR, and MEMBER roles with different permissions
- **Join Requests**: Request to join private communities; admins approve or decline

### 2. Groups

Within each community, create topic-based groups:

- **Neighborhood**: Block-level or street-level groups for hyperlocal coordination
- **School**: School-specific groups for parents and families
- **Playgroup**: Connect families with kids of similar ages
- **Activities**: Sports, arts, music, and after-school coordination
- **Special Needs**: Support groups for families with special needs children
- **Working Parents**: Coordinate around work schedules
- **General Discussion**: Open forum for community topics

### 3. SubGroups

Within groups, create more specific spaces:

- **By Grade & Teacher**: Organize by grade level and teacher name for school groups
- **By Block or Street**: Hyperlocal neighborhood coordination
- **Activity-Specific**: Coordinate around specific shared activities or needs

### 4. Help Requests

- **Request Help**: Post a need to your community — groceries, childcare, transportation, and more
- **Visibility Controls**: Public, semi-anonymous, or admin-only visibility per request
- **Status Tracking**: Open → In Progress → Fulfilled
- **Admin Inbox**: Private channel for sensitive requests that admins can share anonymously

### 5. Posts & Communication

- **Group Posts**: Share updates, questions, and information within groups
- **Rich Content**: Text posts with optional images
- **Comments**: Threaded discussions on posts
- **Request & Offer**: Post a need or offer help to your community

### 6. Direct Messaging

- **Private Messages**: One-on-one conversations with other community members
- **Real-Time Chat**: Instant message delivery via WebSockets
- **Conversation Threads**: Organized message history

### 7. Events

- **Create Events**: Post community events, school activities, and gatherings
- **RSVP**: Track attendance and manage event details
- **Community Scoped**: Events tied to specific communities

### 8. Notifications

- **Activity Alerts**: Get notified about posts, comments, and mentions
- **Message Notifications**: Alerts for new direct messages
- **Customizable Settings**: Control which notifications you receive

### 9. User Profiles

- **Personal Information**: Name, bio, interests, profile picture
- **Location Information**: Address, city, state, zip code
- **Privacy Controls**: Choose exactly what to share with other members

### 10. Multi-Language Support

Built for diverse parent communities:

- **English** (en)
- **Spanish** (es) — Español
- **Somali** (so) — Soomaali
- **Hmong** (hmn) — Hmoob

All content, navigation, and UI elements are fully translated.

## Architecture

### Three-Tier Hierarchy

```
Communities (Neighborhoods & Schools)
  └── Groups (Neighborhood, School, Playgroup, Activities, etc.)
        └── SubGroups (By classroom, by block, by activity)
```

### User Flow

1. **Sign Up / Login**: Create an account or log in with Google
2. **Find Your Community**: Search by zip code to find your neighborhood or school
3. **Join or Request**: Join open communities or request access to private ones
4. **Explore Groups**: Join groups within your community
5. **Participate**: Post, message, request help, and coordinate with other parents

## Tech Stack

### Backend

- **Node.js** — JavaScript runtime
- **Express.js** — Web application framework
- **TypeScript** — Type-safe JavaScript
- **Prisma ORM** — Database toolkit and ORM
- **PostgreSQL** — Relational database (hosted on Railway)
- **JWT** — Authentication and authorization
- **bcrypt** — Password hashing
- **Socket.IO** — Real-time messaging
- **Cloudinary** — Image hosting and management
- **Nodemailer** — Email service
- **Google OAuth 2.0** — Social login

### Frontend

- **React 18** — UI library (Create React App)
- **TypeScript** — Type-safe JavaScript
- **React Router DOM** — Client-side routing
- **Axios** — HTTP client
- **i18next / react-i18next** — Internationalization
- **Tailwind CSS** — Utility-first CSS framework
- **Inter** — UI font
- **Google Maps API** — Location and address autocomplete

### Hosting

- **Vercel** — Frontend deployment
- **Railway** — Backend and database hosting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account (for image uploads)
- Google OAuth credentials (for social login)
- Email service credentials (for password reset emails)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd the-village
```

2. **Install dependencies**

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

3. **Set up environment variables**

Create a `.env` file in the `server/` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/the_village"
JWT_SECRET="your-secure-jwt-secret"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
PORT=8000
```

Create a `.env` file in the `client/` directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

4. **Set up the database**

```bash
cd server
npm run prisma:generate   # Generate Prisma client
npm run migrate:dev       # Run migrations
npm run seed              # (Optional) Seed sample data
```

5. **Start the development servers**

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm start
```

The app will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## Project Structure

```
the-village/
  client/                         # React frontend (Create React App)
    public/                       # Static assets
    src/
      components/                 # Reusable React components
        communities/              # FindYourCommunity, SubGroupCard, etc.
        community/                # AdminInbox, etc.
        forms/                    # AddressAutocomplete, AddressFields
        layout/                   # Header, NotificationBell, LanguageSelector
        map/                      # MapView, DashboardMap
        posts/                    # PostCard, HelpRequestCard, create forms
        settings/                 # NotificationSettings
      context/                    # React contexts (Auth, Socket, GoogleMaps)
      i18n/                       # Internationalization config + locale files
      pages/                      # Full page components
      services/                   # API service layer (axios wrappers)
      types/                      # Shared TypeScript types
      utils/                      # Utility functions (geocoding, etc.)
      App.tsx                     # Routes and app shell
    tailwind.config.js
    package.json

  server/                         # Express backend
    prisma/
      schema.prisma               # Database schema
      migrations/                 # Migration history
      seed.ts                     # Seed data
    src/
      controllers/                # Request handlers
      middleware/                 # Auth, upload middleware
      routes/                     # API route definitions
      services/                   # Business logic (email, cloudinary, etc.)
      index.ts                    # Server entry point
    package.json
```

## API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentication

All protected endpoints require a JWT token:

```
Authorization: Bearer <token>
```

### Key Endpoints

#### Auth
- `POST /auth/signup` — Create account
- `POST /auth/login` — Login, receive JWT
- `POST /auth/forgot-password` — Request reset email
- `POST /auth/reset-password` — Reset with token
- `GET /oauth/google` — Google OAuth login

#### Communities
- `GET /communities` — All communities (with membership status)
- `GET /communities/my-communities` — User's joined communities
- `POST /communities/:id/request-join` — Request to join private community
- `GET /communities/:id/join-requests` — Pending requests (admin only)
- `PUT /communities/:id/join-requests/:requestId` — Approve/decline request

#### Help Requests
- `GET /communities/:id/help-requests` — Community help requests
- `POST /communities/:id/help-requests` — Submit a request
- `PUT /help-requests/:id/status` — Update status

#### Messages
- `GET /messages/conversations` — All conversations
- `GET /messages/:userId` — Thread with a user
- `POST /messages` — Send message

#### Posts, Events, Search
- Standard CRUD endpoints scoped to communities and groups

## Internationalization

To add a new language:

1. Create `client/src/i18n/locales/<code>.json` (copy structure from `en.json`)
2. Translate all strings
3. Register it in `client/src/i18n/config.ts`
4. Add it to the `LanguageSelector` component

## Database Schema

### Core Models

- **User** — Auth, profile, privacy settings
- **Community** — Neighborhood or school, with location and membership
- **CommunityMember** — Join table with role (ADMIN / MODERATOR / MEMBER)
- **JoinRequest** — Pending requests to join private communities
- **Group** — Topic-based spaces within a community
- **SubGroup** — Classroom or block-level sub-spaces
- **Post** — Content shared within groups
- **HelpRequest** — Requests for help with visibility controls
- **Event** — Community events with RSVP
- **Message** — Direct messages between users
- **Notification** — Activity alerts

---

*Personal project by Zenna James — built with [Claude Code](https://claude.ai/code)*
