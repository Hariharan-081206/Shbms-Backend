import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import allowedUsers from './allowedUsers.js';

const configurePassport = (app) => {
  if (!app.locals?.models) {
    throw new Error('❌ Models not initialized! Make sure to set app.locals.models before calling configurePassport.');
  }

  const { User } = app.locals.models;

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      console.log('📧 Email from Google:', email);

      if (!email) {
        console.log('❌ No email found in Google profile');
        return done(new Error('No email found in Google profile'), null);
      }

      const role = allowedUsers.get(email);
      console.log('🎭 Role from allowedUsers:', role);

      if (!role) {
        console.log('🚫 Unauthorized user:', email);
        return done(null, false, { message: 'Unauthorized user' });
      }

      let user = await User.findOne({ email });

      if (!user) {
        console.log('🆕 Creating new user for:', email);
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email,
          role
        });
      } else {
        let updated = false;

        if (!user.googleId) {
          user.googleId = profile.id;
          updated = true;
        }

        if (user.role !== role) {
          user.role = role;
          updated = true;
        }

        if (updated) {
          await user.save();
          console.log('🔄 Updated existing user:', email);
        }
      }

      return done(null, user);
    } catch (error) {
      console.error('❌ Passport GoogleStrategy error:', error);
      return done(error, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;
