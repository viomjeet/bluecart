'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { HelpCircle } from "lucide-react";

const CNAME = "BLUECART";
const footerData = {
    brand: {
        name: CNAME,
        description: "Delivering next-generation shopping with premium curated products, seamless architecture, and pixel-perfect customer care."
    },
    sections: [
        {
            title: "Company",
            links: [
                { name: "Home", path: "/", disabled: false },
                { name: "products", path: "/pages/products", disabled: false },
                { name: "Careers", path: "/pages/careers", disabled: false },
                { name: "Contact", path: "/pages/contact", disabled: false }
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", path: "/pages/privacy", disabled: true },
                { name: "Terms of Service", path: "/pages/terms", disabled: true },
                { name: "Cookie Policy", path: "/pages/cookies", disabled: true }
            ]
        }
    ],
    socials: [
        { platform: "Github", url: "https://github.com/viomjeet", icon: "Github" },
        { platform: "Linkedin", url: "https://linkedin.com/in/viomjeet/", icon: "Linkedin" },
        { platform: "Twitter", url: "https://twitter.com/viomjeet", icon: "Twitter" }
    ],
    copyright: `© ${new Date().getFullYear()} ${CNAME}. All rights reserved.`
};

const socialIconMap: Record<string, any> = {
    Github: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    ),
    Linkedin: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    ),
    Twitter: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
    )
};


interface FooterData {
    brand: { name: string; description: string };
    sections: Array<{ title: string; links: Array<{ name: string; path: string, disabled: boolean }> }>;
    socials: Array<{ platform: string; url: string; icon: string }>;
    copyright: string;
}

export default function Footer() {
    const [data, setData] = useState<FooterData | null>(footerData || null);


    return (
        <footer className="w-full bg-nav text-foreground border-t border-foreground/10 pt-16 pb-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
                <div className="md:col-span-4 flex flex-col gap-4">
                    <h2 className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-bold tracking-wider uppercase">{data?.brand?.name}</h2>
                    <p className="text-sm text-foreground/60 leading-relaxed max-w-sm">
                        {data?.brand?.description}
                    </p>
                </div>
                <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
                    {data?.sections?.map((section, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            <h3 className="text-sm font-bold uppercase text-foreground/40">
                                {section.title}
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {section.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link
                                            href={link.path}
                                            onClick={(e) => { if (link.disabled) { e.preventDefault(); } }}
                                            className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-150"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="md:col-span-2 flex flex-col gap-4 md:items-end">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/40">
                        Follow Us
                    </h3>
                    <div className="flex gap-3">
                        {data?.socials?.map((social, idx) => {
                            const IconComponent = socialIconMap[social.icon] || HelpCircle;
                            if (social.platform !== "Twitter") {
                                return (
                                    <a
                                        key={idx}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-all duration-150"
                                        aria-label={social.platform}
                                    >
                                        <IconComponent className="h-4 w-4" />
                                    </a>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-foreground/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground/40">
                <p>{data?.copyright}</p>
                <p
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="hover:text-foreground transition-colors cursor-pointer select-none active:scale-95"
                >Back to top ↑</p>
            </div>
        </footer>
    );
}