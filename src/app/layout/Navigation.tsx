'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, Briefcase, Phone, Menu, X, ShoppingBag } from 'lucide-react'; // ShoppingBag icon add kiya
import ThemeToggle from './ThemeToggle';
// Cart Context ko relative path se import kiya (Aapki file hierarchy ke mutabik)
import { useCart } from '../context/CartContext'; 

const menus = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/pages/products', icon: Briefcase },
    { name: 'Contact', path: '/pages/contact', icon: Phone },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    
    // Context se real-time dynamic totalCount pull kiya
    const { cartCount } = useCart();

    return (
        <nav className="border-b border-foreground/10 bg-nav text-foreground px-6 py-4 relative z-50">
            <div className="flex items-center justify-between max-w-9xl mx-auto">
                <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-bold tracking-wider uppercase"
                >
                    BLUECART
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {menus.map((menu) => {
                        const Icon = menu.icon;
                        const isActive = pathname === menu.path;
                        return (
                            <Link
                                key={menu.path}
                                href={menu.path}
                                className={`flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors duration-200 ${
                                    isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground'
                                }`}
                            >
                                <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'scale-105 text-foreground' : 'text-foreground/50'}`} />
                                <span>{menu.name}</span>
                            </Link>
                        );
                    })}

                    {/* Desktop Cart Icon Link with Dynamic Badge */}
                    <Link
                        href="/pages/cart"
                        className="relative p-1 text-foreground/60 hover:text-foreground transition-colors"
                        aria-label="View Cart"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white dark:bg-blue-500 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-fade-in">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <div className="pl-2 border-l border-foreground/10">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Icons Left/Right Aligned */}
                <div className="flex items-center gap-4 md:hidden">
                    {/* Mobile Cart Icon Link */}
                    <Link
                        href="/pages/cart"
                        onClick={() => setIsOpen(false)}
                        className="relative p-1 text-foreground/70 hover:text-foreground transition-colors"
                        aria-label="View Cart"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white dark:bg-blue-500 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <ThemeToggle />
                    
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-1 text-foreground/70 hover:text-foreground transition-colors focus:outline-none"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

            </div>

            {/* Mobile Dropdown Menu */}
            <div className={`md:hidden absolute top-full left-0 w-full border-b border-foreground/10 bg-nav/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
                isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}>
                <div className="flex flex-col gap-4 px-6 py-5">
                    {menus.map((menu) => {
                        const Icon = menu.icon;
                        const isActive = pathname === menu.path;
                        return (
                            <Link
                                key={menu.path}
                                href={menu.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 py-2 text-base font-medium transition-colors ${
                                    isActive ? 'text-foreground font-semibold' : 'text-foreground/60'
                                }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? 'text-foreground' : 'text-foreground/50'}`} />
                                <span>{menu.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}