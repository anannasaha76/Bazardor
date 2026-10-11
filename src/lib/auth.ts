
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGODB_URI;
const baseURL = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET;

if (!uri) throw new Error("MONGODB_URI is missing");
if (!baseURL) throw new Error("BETTER_AUTH_URL is missing");
if (!secret) throw new Error("BETTER_AUTH_SECRET is missing");

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
  mongoUri?: string;
};

if (globalForMongo.mongoUri && globalForMongo.mongoUri !== uri) {
  throw new Error("MongoDB URI changed within the same runtime");
}

const client =
  globalForMongo.mongoClient ?? new MongoClient(uri);

globalForMongo.mongoClient = client;
globalForMongo.mongoUri = uri;

const db = client.db();

export const auth = betterAuth({
  baseURL,
  secret,

  trustedOrigins: [
    "http://localhost:3000",
    baseURL,
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },

  database: mongodbAdapter(db, { client }),
});
