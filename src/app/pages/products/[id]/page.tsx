'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import axios from 'axios';
// Import path ko depth ke hisab se set kiya
import { useCart } from '../../../context/CartContext';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { addToCart } = useCart();
  const defaultImage = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80";
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        const data = response.data;
        setProduct(data);
        if (data.slider_images && data.slider_images.length > 0) {
          setSelectedImage(data.slider_images[0]);
        }
      } catch (error: any) {
        setErrorMsg(
          error.response?.data?.error || error.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleCartItems = async () => {
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error("Failed to add:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm font-medium tracking-wide animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <p className="text-red-500 font-medium text-sm mb-4">Error: {errorMsg || "Product not found"}</p>
        <Link href={'/pages/products'} className="px-4 py-2.5 bg-card text-xs font-bold rounded-xl shadow-sm border border-muted/40 hover:bg-muted transition-all">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 max-w-7xl mx-auto selection:bg-blue-500/20">
      
      <div className="mb-8">
        <Link href={'/pages/products'}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card text-xs font-bold text-muted-foreground hover:text-foreground shadow-sm transition-all hover:scale-[1.01]"
        > 
          ← Back to Products 
        </Link>
      </div>
      
      <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm bg-gradient-to-b from-card to-card/50 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="w-full">
          <div className='flex flex-col-reverse md:flex-row gap-4 w-full'>
            
            <div className='flex flex-row md:flex-col gap-3 overflow-auto justify-center md:justify-start shrink-0 p-1.5 scrollbar-none max-h-[400px]'>
              {product.slider_images?.map((item: any, index: any) => (
                <div 
                  key={index}
                  onClick={() => setSelectedImage(item)}
                  className={`w-16 h-16 rounded-xl cursor-pointer overflow-hidden transition-all duration-200 shrink-0 ${
                    selectedImage === item 
                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card scale-[1.03] opacity-100 shadow-md' 
                    : 'opacity-60 hover:opacity-100 border border-muted'
                  }`}
                >
                  <img src={item || defaultImage} alt={`${product.name} image ${index + 1}`} className="w-full h-full object-cover object-center" />
                </div>
              ))}
            </div>

            <div className='flex-1 aspect-[4/3] md:aspect-square bg-muted/40 rounded-2xl overflow-hidden shadow-sm relative group cursor-zoom-in'>
              <img
                src={selectedImage || defaultImage}
                alt={`${product.name}`}
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full justify-between py-1">
          <div>
            <div className='mb-4'>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-muted text-muted-foreground px-3 py-1.5 rounded-full shadow-2xs">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">
              {product.name}
            </h1>

            <div className="mb-8 bg-muted/30 p-4 rounded-xl inline-block min-w-[160px]">
              <span className="text-[9px] uppercase font-bold text-muted-foreground/70 tracking-wider block mb-1">Price</span>
              <span className="text-3xl font-black tracking-tight text-foreground">
                ₹{typeof product.price === 'string' ? parseFloat(product.price).toLocaleString('en-IN') : product.price?.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="border-t border-muted/40 pt-6">
              <h3 className="text-xs font-bold uppercase text-muted-foreground/60 tracking-wider mb-2.5">Product Description</h3>
              <p className="text-sm leading-relaxed text-muted-foreground font-medium max-w-xl">
                {product.description}
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-muted/40 flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow transition-all duration-200 hover:bg-blue-700 active:scale-95 text-center text-xs cursor-pointer">
              Buy Now
            </button>
            <button 
              onClick={handleCartItems}
              className="flex-1 bg-foreground text-background hover:bg-neutral-800 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-200 font-bold py-3.5 px-6 rounded-xl shadow transition-all duration-200 active:scale-95 text-center text-xs cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}