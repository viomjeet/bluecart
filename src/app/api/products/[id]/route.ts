import { connectDB } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
export async function GET(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: "Product ID is missing" }, { status: 400 });
    }
    const pool = await connectDB();
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