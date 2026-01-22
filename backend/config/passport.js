const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

console.log('🔐 Passport configuration loaded');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🎉 Google OAuth callback received!');
        console.log('📧 Email:', profile.emails[0].value);

        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (user) {
          console.log('✅ User found:', user.email, '| Role:', user.role);
          
          // Update Google ID if not set
          if (!user.googleId) {
            user.googleId = profile.id;
            user.profileImage = profile.photos?.[0]?.value || user.profileImage;
            await user.save();
            console.log('✅ Google ID and photo saved');
          }
          
          // IMPORTANT: Return the user object
          return done(null, user);
        }

        // User doesn't exist
        console.log('❌ No user found with email:', email);
        console.log('💡 User must be added by Super Admin first');
        
        // Return false with error message
        return done(null, false, { 
          message: 'No account found. Please contact your administrator.' 
        });

      } catch (err) {
        console.error('❌ Google auth error:', err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('📝 Serializing user:', user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('📖 Deserializing user:', id);
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error('❌ Deserialize error:', err);
    done(err, null);
  }
});

console.log('✅ Passport Google Strategy configured');

module.exports = passport;