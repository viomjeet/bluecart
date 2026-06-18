import { connectDB } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

// Next.js ke strict types ke anusaar context interface define kiya
interface RouteContext {
  params: Promise<{ id: string }>;
}

// 1. NextRequest use kiya standard Request ki jagah
// 2. Type definition ko Promise structure mein set kiya
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // CRITICAL FIX: context.params ko await karke resolve kiya
    const { id } = await context.params;
    
    const pool = await connectDB();

    // Aapka aggregate slider images wala query bilkul sahi hai, use waisa hi rakha hai
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        p.category,
        p.description,
        COALESCE(
          ARRAY_AGG(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), 
          ARRAY[]::TEXT[]
        ) AS slider_images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = $1
      GROUP BY p.id;
    `;

    const result = await pool.query(query, [id]);
    const product = result.rows[0];

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });

  } catch (error: any) {
    console.error("Database ID routing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch product data." }, 
      { status: 500 }
    );
  }
}