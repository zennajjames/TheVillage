import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { prisma } from './database';

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with this email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // Link Google account to existing user
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId: profile.id,
                provider: 'google',
                providerId: profile.id,
                profilePicture: user.profilePicture || profile.photos?.[0]?.value,
              },
            });
            return done(null, user);
          }
        }

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            email: email || `${profile.id}@google.temp`,
            googleId: profile.id,
            provider: 'google',
            providerId: profile.id,
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            profilePicture: profile.photos?.[0]?.value,
            location: 'Unknown', // Will be updated when user enters zip code
            zipCode: '00000', // Placeholder
            isVerified: true, // Google accounts are pre-verified
            agreedToGuidelines: false, // User must agree to guidelines
          },
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
    )
  );
} else {
  console.warn('⚠️  Google OAuth not configured - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required');
}

// Only configure Facebook OAuth if credentials are provided
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:8000/api/oauth/facebook/callback',
        profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Facebook ID
        let user = await prisma.user.findUnique({
          where: { facebookId: profile.id },
        });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with this email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // Link Facebook account to existing user
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                facebookId: profile.id,
                provider: 'facebook',
                providerId: profile.id,
                profilePicture: user.profilePicture || profile.photos?.[0]?.value,
              },
            });
            return done(null, user);
          }
        }

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            email: email || `${profile.id}@facebook.temp`,
            facebookId: profile.id,
            provider: 'facebook',
            providerId: profile.id,
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            profilePicture: profile.photos?.[0]?.value,
            location: 'Unknown', // Will be updated when user enters zip code
            zipCode: '00000', // Placeholder
            isVerified: true, // Facebook accounts are pre-verified
            agreedToGuidelines: false, // User must agree to guidelines
          },
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
    )
  );
} else {
  console.warn('⚠️  Facebook OAuth not configured - FACEBOOK_APP_ID and FACEBOOK_APP_SECRET are required');
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
