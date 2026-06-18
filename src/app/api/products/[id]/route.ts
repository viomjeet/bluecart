import { connectDB } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params; // await karna mandatory hai
    const pool = await connectDB();
    
    // ... baki query execute block
    return NextResponse.json({ success: true });
  } catch (e) { 
    return NextResponse.json({ error: "Fail" }); 
  }
}