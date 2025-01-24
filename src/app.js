import session from 'express-session';
import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import http from 'http';


import authRouter from './src/routes/authRoutes.js';
import userRouter from './src/routes/userRoutes.js';
import profileRouter from './src/routes/profileRoutes.js';
import postRouter from './src/routes/postRoutes.js';
import messageRouter from './src/routes/messageRoute.js'

// Import database connection
import { connectToDatabase } from './src/config/mongooseConnect.js';



// Configure environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Session management
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'secret',
		cookie: {
			maxAge: 7 * 24 * 60 * 60 * 1000 // ms
		},
		resave: true,
		saveUninitialized: true,
		store: new PrismaSessionStore(
			new PrismaClient(),
			{
				checkPeriod: 2 * 60 * 1000, // ms
				dbRecordIdIsSessionId: true,
				dbRecordIdFunction: undefined,
			}
		)
	})
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static('uploads'))

// Connect to the database
connectToDatabase();

// Set up routes
app.use('/v1/', authRouter);
app.use('/v1/', userRouter);
app.use('/v1/', profileRouter);
app.use('/v1/', postRouter);
app.use('/v1/', messageRouter);

// Create HTTP server
const server = http.createServer(app);

export default server;


