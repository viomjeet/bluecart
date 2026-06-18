import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    const pool = await connectDB();
    
    const query = `
      SELECT p.id, p.name, p.price, p.category, p.description,
        (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) AS main_image
      FROM products p
      ORDER BY p.id ASC;
    `;
    
    const result = await pool.query(query);

    // App Router me NextResponse.json() use hota hai
    return NextResponse.json(result.rows, { status: 200 });

  } catch (error: any) {
    console.error("Database error in App Router API:", error);
    
    return NextResponse.json(
      { error: "Database error occurred", details: error.message },
      { status: 500 }
    );
  }
}