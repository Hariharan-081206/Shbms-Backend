// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import allowedUsers from './allowedUsers.js'; // Static email-to-role mapping

export default function configurePassport(app) {
  if (!app.locals?.models) {
    throw new Error('❌ Models not initialized! Make sure to set app.locals.models before calling configurePassport.');
  }

  const { User } = app.locals.models;

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;

      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }

      // ✅ Block users not in your whitelist
      const role = allowedUsers[email];
      if (!role) {
        return done(null, false, { message: 'Unauthorized user' });
      }

      // 🔍 Look up user by email
      let user = await User.findOne({ email });

      if (!user) {
        // 🆕 Create user with role from map
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email,
          role
        });
      } else {
        // 🔄 Update existing user if needed
        let updated = false;

        if (!user.googleId) {
          user.googleId = profile.id;
          updated = true;
        }

        if (user.role !== role) {
          user.role = role;
          updated = true;
        }

        if (updated) await user.save();
      }

      return done(null, user);
    } catch (err) {
      console.error('Passport error:', err);
      return done(err, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id); // Stores user ID in session
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}
