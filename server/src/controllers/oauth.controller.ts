import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from '../config/passport';

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

// Helper function to handle OAuth callback logic
const handleOAuthCallback = (provider: string) => (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(provider, { session: false }, (err: any, user: any, info: any) => {
    if (err || !user) {
      console.error(`OAuth ${provider} callback error:`, err);
      console.error(`OAuth ${provider} user:`, user);
      console.error(`OAuth ${provider} info:`, info);
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
    }

    // Check if user has agreed to guidelines
    if (!user.agreedToGuidelines) {
      // Generate a temporary token for completing onboarding
      const tempToken = jwt.sign(
        { userId: user.id, needsGuidelines: true },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      return res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:3000'}/onboarding?token=${tempToken}&step=guidelines`
      );
    }

    // Check if user has set their zip code
    if (!user.zipCode || user.zipCode === '00000') {
      // Generate a temporary token for completing onboarding
      const tempToken = jwt.sign(
        { userId: user.id, needsZipCode: true },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      return res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:3000'}/onboarding?token=${tempToken}&step=zipcode`
      );
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    // Redirect to client with token
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?token=${token}`);
  })(req, res, next);
};

export const googleCallback = handleOAuthCallback('google');

export const facebookAuth = passport.authenticate('facebook', {
  scope: ['email', 'public_profile'],
  session: false,
});

export const facebookCallback = handleOAuthCallback('facebook');

export const completeOnboarding = async (req: Request, res: Response) => {
  try {
    const { zipCode, agreedToGuidelines } = req.body;
    const userId = req.user!.id;

    const updateData: any = {};

    if (zipCode) {
      updateData.zipCode = zipCode;
      updateData.location = zipCode; // Use zipCode as location
    }

    if (agreedToGuidelines) {
      updateData.agreedToGuidelines = true;
      updateData.guidelinesAgreedAt = new Date();
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        zipCode: true,
        agreedToGuidelines: true,
      },
    });

    // Generate new token without temporary flags
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.json({ token, user });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({ error: 'Failed to complete onboarding' });
  }
};

// Import prisma at the top
import { prisma } from '../config/database';
