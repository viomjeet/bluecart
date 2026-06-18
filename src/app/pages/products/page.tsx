'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: string | number;
  category: string;
  description: string;
  main_image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('/api/products')
      .then((response) => {
        setProducts(response.data);

        const uniqueCategories = [
          'All',
          ...Array.from(new Set(response.data.map((p: Product) => p.category))).filter(Boolean) as string[]
        ];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Axios fetch error:", error);
        setErrorMsg("Failed to load products from server.");
        setLoading(false);
      });
  }, []);

  const handleCartItems = async (product: any) => {
    await addToCart(product.id);
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm font-medium tracking-wide animate-pulse">Loading products...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-red-500 font-medium">
        {errorMsg}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 max-w-7xl mx-auto selection:bg-blue-500/20">

      {/* Top Header Section: Title on Left, Categories on Right */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 pb-6 border-b border-muted/20">
        <div>
          <h2 className="font-sans font-extrabold text-3xl tracking-tight mb-1 text-foreground">
            Discover Products
          </h2>
          <p className="font-sans text-sm text-muted-foreground/80 font-medium">
            Our latest collection, curated just for you.
          </p>
        </div>

        {/* Categories Right Aligned */}
        <div className="flex flex-wrap gap-2 pb-4 overflow-x-auto scrollbar-none md:justify-end">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-200 shadow-sm whitespace-nowrap ${selectedCategory === category
                ? 'bg-foreground text-background shadow-md transform scale-[1.02]'
                : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Clean & Professional Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product: any) => (
          <div
            key={product.id}
            className="group bg-card text-foreground overflow-hidden flex flex-col justify-between p-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-b from-card to-card/50"
          >
            {/* Clickable Area */}
            <Link href={`/pages/products/${product.id}`} className="flex flex-col flex-grow">
              <div className="w-full aspect-[4/3] bg-muted/60 rounded-xl relative overflow-hidden">
                <img
                  src={product.main_image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-orange-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                  Only {Math.floor(Math.random() * 10) + 3} Left
                </span>
              </div>

              {/* Product Info */}
              <div className="pt-4 pb-3 px-1 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed font-medium">
                    {product.description}
                  </p>
                </div>
              </div>
            </Link>

            {/* Bottom Row (Price & CTA) */}
            <div className="px-1 pt-2 border-t border-muted/40 mt-auto flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase text-muted-foreground/60 font-bold tracking-wider mb-0.5">Price</span>
                <span className="text-lg font-black tracking-tight text-foreground">
                  ₹{typeof product.price === 'string' ? parseFloat(product.price).toLocaleString('en-IN') : product.price.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type='button'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCartItems(product);
                }}
                className="inline-flex items-center justify-center bg-foreground text-background hover:bg-neutral-800 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-200 text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Add to Cart
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}