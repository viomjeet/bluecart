import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    const { productId, quantity = 1 } = await request.json();
    const userId = 1;
    const pool = await connectDB();
    const query = `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, productId, quantity]);
    return NextResponse.json({ success: true, item: result.rows[0] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Cart update failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = 1;
    const pool = await connectDB();

    // PERFECT JOIN QUERY: Ab ye har product ki pehli image (MIN image_url) product_images table se nikal kar layega
    const query = `
      SELECT 
        c.id AS cart_item_id,
        c.quantity,
        p.id AS product_id,
        p.name,
        p.price,
        p.category,
        (
          SELECT pi.image_url 
          FROM product_images pi 
          WHERE pi.product_id = p.id 
          ORDER BY pi.id ASC 
          LIMIT 1
        ) AS main_image -- Har product ki pehli image ko 'main_image' bana diya
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    
    const totalCount = result.rows.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({ 
      items: result.rows, 
      totalCount: totalCount 
    }, { status: 200 });

  } catch (error: any) {
    console.error("DATABASE GET ERROR:", error);
    return NextResponse.json({ 
      error: `Database Layer Error: ${error.message}` 
    }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('cartItemId');
    const userId = 1; // Dummy User ID layer

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart Item ID is required" }, { status: 400 });
    }

    const pool = await connectDB();

    // Query jo user id aur cart item id dono check karke safely delete karegi
    const query = `
      DELETE FROM cart_items 
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [cartItemId, userId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Item not found in your cart" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item removed from cart" }, { status: 200 });

  } catch (error: any) {
    console.error("API DELETE Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete item" }, { status: 500 });
  }
}

