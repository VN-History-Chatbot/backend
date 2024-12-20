import * as dotenv from "dotenv";

dotenv.config();

// App
export const APP_NAME = process.env.APP_NAME;
export const APP_ENV = process.env.APP_ENV;
export const APP_VERSION = process.env.APP_VERSION;

// Server
export const HTTP_PORT = process.env.HTTP_PORT || 8080;
export const HTTP_CORS = process.env.HTTP_CORS;
export const HTTP_CORS_METHODS = process.env.HTTP_CORS_METHODS;

// Database
export const DB_HOST = process.env.DB_HOST;

// Jwt
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_AT_EXPIRED = process.env.JWT_AT_EXPIRED as unknown as number;
export const JWT_RT_EXPIRED = process.env.JWT_RT_EXPIRED as unknown as number;

// AI
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Redis
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// Google
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
export const GOOGLE_LOGIN_URL = process.env.GOOGLE_LOGIN_URL;

// Mongodb
export const MONGO_HOST = process.env.MONGO_HOST;

// AI
export const HF_TOKEN = process.env.HF_TOKEN;
export const OPENAI_TOKEN = process.env.OPENAI_TOKEN;

// Firebase
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
export const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
export const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;
