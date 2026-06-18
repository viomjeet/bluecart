'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const { fetchCartCount } = useCart();
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

    const handleDeleteItem = async (cartItemId: number, productName: string) => {
        try {
            await axios.delete(`/api/cart?cartItemId=${cartItemId}`);
            setCartItems((prevItems) => prevItems.filter(item => item.cart_item_id !== cartItemId));
            toast.success(`"${productName}" removed from cart`);
            if (fetchCartCount) {
                await fetchCartCount();
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to remove item");
        }
    };

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
            <div className="min-h-screen flex items-center justify-center bg-background text-red-500 font-medium text-sm">
                {errorMsg}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 py-12 w-full max-w-7xl mx-auto selection:bg-blue-500/20">
            <div className="mb-10 border-b border-gray-200 pb-6">
                <h2 className="font-sans font-notmal text-2xl mb-2">
                    Shopping Cart
                </h2>
                <p className="font-sans font-normal text-sm opacity-80">
                    {cartItems.length === 0 ? "Your cart is empty." : `You have ${cartItems.length} unique items in your cart.`}
                </p>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl shadow-xs border border-gray-200 max-w-2xl mx-auto">
                    <p className="font-sans font-normal text-sm opacity-80 mb-6">No products found in your database layer.</p>
                    <Link href="/pages/products" className="inline-flex items-center justify-center bg-foreground text-background dark:bg-white dark:text-slate-950 text-xs font-bold px-6 py-3 rounded-xl shadow transition-all hover:opacity-90">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left Stack List */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.cart_item_id}
                                className="group bg-card p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-gray-200 transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="w-20 h-20 bg-muted/40 rounded-xl overflow-hidden shrink-0 border border-muted/10">
                                        <img
                                            src={item.main_image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"}
                                            alt={item.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[9px] uppercase font-bold text-blue-500 tracking-wider block mb-0.5">
                                            {item.category}
                                        </span>
                                        <h4 className="text-sm font-bold text-foreground truncate max-w-[200px] sm:max-w-[260px]">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs font-medium text-muted-foreground mt-1">
                                            Quantity: <span className="text-foreground font-bold bg-muted/60 px-2 py-0.5 rounded ml-0.5 text-[11px]">{item.quantity}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Right details block */}
                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-muted/10 mt-2 sm:mt-0">
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm font-black tracking-tight text-foreground">
                                            ₹{((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">
                                            ₹{(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toLocaleString('en-IN')} each
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteItem(item.cart_item_id, item.name)}
                                        className="p-2 text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-red-500/10"
                                        aria-label="Delete item"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-card p-6 rounded-2xl shadow-xs border border-gray-200 flex flex-col gap-5 sticky top-24">
                        <h3 className="text-xs font-bold uppercase text-muted-foreground/60 tracking-wider border-b border-muted/20 pb-3">
                            Order Summary
                        </h3>

                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground font-medium">Subtotal</span>
                            <span className="font-bold text-foreground">₹{calculateTotal().toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span>Shipping</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase text-[9px] tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">Free</span>
                        </div>

                        <div className="border-t border-muted/20 pt-4 mt-2 flex justify-between items-end">
                            <span className="text-xs font-bold text-foreground">Total Amount</span>
                            <span className="text-xl font-black tracking-tight text-foreground">
                                ₹{calculateTotal().toLocaleString('en-IN')}
                            </span>
                        </div>

                        <button className="w-full bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-xs transition-all duration-200 hover:bg-blue-700 active:scale-97 text-center text-xs cursor-pointer mt-3 tracking-wide">
                            Proceed to Checkout
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}