import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/bazardor";
const client = new MongoClient(uri);
const db = client.db();

export const auth = betterAuth({
    emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  database: mongodbAdapter(db, {
    client,
  }),
});