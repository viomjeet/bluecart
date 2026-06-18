import { Pool } from 'pg';
const connectionString = "postgresql://neondb_owner:npg_XZRa30QDlnwM@ep-winter-lake-aox3xccg-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const pool = new Pool({ connectionString: connectionString });
export async function connectDB() {
  return pool;
}