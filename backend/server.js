import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import userRoutes from './routes/users.js';
import superadminRoutes from './routes/superadmin.js';
import settingsRoutes from './routes/settings.route.js';
import rolesRoutes from './routes/roles.route.js'; 

const app = express();

// ------------------ MIDDLEWARE ------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Use true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// ------------------ ROUTES ------------------
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/organization',rolesRoutes)
// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Payroll API is running' });
}); 

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;

try {
  await connectDB(); // top-level await
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
} catch (err) {
  console.error('❌ Failed to start server:', err);
}
