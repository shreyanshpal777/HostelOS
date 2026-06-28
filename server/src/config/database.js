import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  if (env.MONGODB_DNS_SERVERS.length) {
    dns.setServers(env.MONGODB_DNS_SERVERS);
  }

  await mongoose.connect(env.MONGODB_URI);
  console.log('MongoDB connected');
}