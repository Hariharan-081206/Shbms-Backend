import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import session from 'express-session';
import passport from 'passport';
import bedDashboardRouter from './routers/bedrouter.js';
import patientRoutes from './routers/patientdetailsrouter.js';
import authRoutes from './routers/authrouter.js'; 
import configurePassport from './config/passport.js'; 

import User from './models/user.js'; 

const app = express();
const server = http.createServer(app);

// 👇 Add model references for passport config
app.locals.models = { User }; // or { User, Host } if Host is used

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// ✅ Sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());
configurePassport(app); // must come after app.locals.models

// Routes
app.use('/api/patients', patientRoutes); 
app.use('/api/beds',bedDashboardRouter);      
app.use('/auth', authRoutes);                 

// Health check
app.get('/', (req, res) => {
  res.send('🩺 Patient Management Server is up and running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('⚠️ Server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('❌ Fatal startup error:', err);
  process.exit(1);
});
