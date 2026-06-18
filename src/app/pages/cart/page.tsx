'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/cart');
            setCartItems(response.data.items || []);
        } catch (error: any) {
            setErrorMsg("Failed to load cart items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // DELETE HANDLER: Sirf database se delete karega aur list refresh karega
    const handleDeleteItem = async (cartItemId: number) => {
        try {
            await axios.delete(`/api/cart?cartItemId=${cartItemId}`);
            // Bina page reload kiye state se hatane ke liye
            setCartItems((prevItems) => prevItems.filter(item => item.cart_item_id !== cartItemId));
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to remove item");
        }
    };

    // Total Order Amount Calculate karne ke liye
    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
            return sum + (price * item.quantity);
        }, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <p className="text-sm font-medium tracking-wide animate-pulse">Loading your cart...</p>
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
        <div className="min-h-screen bg-background text-foreground px-6 py-12 max-w-5xl mx-auto selection:bg-blue-500/20">
            <div className="mb-10">
                <h2 className="font-sans font-extrabold text-3xl tracking-tight mb-2 text-foreground">
                    Shopping Cart
                </h2>
                <p className="font-sans text-sm text-muted-foreground/80 font-medium">
                    {cartItems.length === 0 ? "Your cart is empty." : `You have ${cartItems.length} unique items in your cart.`}
                </p>
            </div>
            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl shadow-sm border border-muted/10">
                    <p className="text-muted-foreground font-medium text-sm mb-6">No products found in your database layer.</p>
                    <Link href="/pages/products" className="inline-flex items-center justify-center bg-foreground text-background dark:bg-white dark:text-slate-950 text-xs font-bold px-6 py-3 rounded-xl shadow transition-all hover:opacity-90">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.cart_item_id}
                                className="bg-card p-4 rounded-2xl shadow-sm flex gap-4 items-center justify-between border border-muted/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-muted/60 rounded-xl overflow-hidden shrink-0">
                                        <img
                                            src={item.main_image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"}
                                            alt={item.name}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-wider block mb-0.5">
                                            {item.category}
                                        </span>
                                        <h4 className="text-sm font-bold text-foreground line-clamp-1 max-w-[180px] sm:max-w-[280px]">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs font-semibold text-muted-foreground mt-1">
                                            Quantity: <span className="text-foreground font-bold">{item.quantity}</span>
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Right Side: Price aur Delete Button wrapper */}
                                <div className="flex items-center gap-4">
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-black tracking-tight text-foreground">
                                            ₹{((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/70 font-medium mt-0.5">
                                            ₹{(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toLocaleString('en-IN')} each
                                        </p>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteItem(item.cart_item_id)}
                                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                        aria-label="Delete item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.72 0-.34-9m9.96-3.244l-.6 11.666a2.25 2.25 0 0 1-2.247 2.114H7.822c-1.213 0-2.222-.988-2.247-2.114L5 5.756m5.75-3.15h3.5m-7.5 0h11.5m-11.5 0h11.5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-muted/5 flex flex-col gap-6 sticky top-6">
                        <h3 className="text-sm font-bold uppercase text-muted-foreground/60 tracking-wider border-b border-muted/30 pb-3">
                            Order Summary
                        </h3>

                        <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground font-medium">Subtotal</span>
                            <span className="text-sm font-bold text-foreground">₹{calculateTotal().toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                            <span>Shipping</span>
                            <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">Free</span>
                        </div>

                        <div className="border-t border-muted/30 pt-4 flex justify-between items-end">
                            <span className="text-xs font-bold text-foreground">Total Amount</span>
                            <span className="text-xl font-black tracking-tight text-foreground">
                                ₹{calculateTotal().toLocaleString('en-IN')}
                            </span>
                        </div>

                        <button className="w-full bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow transition-all duration-200 hover:bg-blue-700 active:scale-95 text-center text-xs cursor-pointer mt-2">
                            Proceed to Checkout
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}