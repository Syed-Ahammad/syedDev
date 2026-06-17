import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Reuse a single connection across hot reloads in dev and across invocations in
// serverless. Without this cache, every HMR cycle / cold start opens a new pool
// and quickly exhausts Atlas's connection limit.
declare global {
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

/**
 * Connect to MongoDB (cached). Call this at the top of any API route or server
 * action that touches the database. Safe to call repeatedly — subsequent calls
 * reuse the established connection.
 */
export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see .env.example).",
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next call retries instead of awaiting a rejected promise.
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default dbConnect;
