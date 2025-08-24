"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import WalletStatus from "@/components/wallet-status";
import { clearSession } from "@/components/auth/jwt";

export default function SiteNavbar() {
  const pathname = usePathname();

  // Hide the global navbar on landing pages to avoid double navbars
  if (pathname === "/" || pathname?.startsWith("/landing-ledger")) {
    return null;
  }

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/university", label: "Issuer Hub" },
    { href: "/public-ledger", label: "Public Ledger" },
  ];

  const [userProfile, setUserProfile] = useState<{
    walletAddress: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vericred_wallet");
      const userRaw = localStorage.getItem("vericred_user");
      let addr = null;
      let role = "Individual";
      if (raw) {
        const parsed = JSON.parse(raw);
        addr = parsed?.address || parsed?.walletAddress || null;
      }
      if (userRaw) {
        const parsedUser = JSON.parse(userRaw);
        role = parsedUser?.role || role;
      }
      if (addr) setUserProfile({ walletAddress: addr, role });
    } catch (e) {
      setUserProfile(null);
    }
  }, []);

  const handleDisconnect = () => {
    try {
      clearSession();
      localStorage.removeItem("vericred_user");
    } catch (e) {}
    if (typeof window !== "undefined") window.location.reload();
  };

  // mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="supports-[backdrop-filter]:backdrop-blur-md bg-white/70 dark:bg-gray-950/60 border-b border-black/10 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Brand */}
            <Link href="/home" className="flex items-center gap-3">
              <Logo size="md" showText={false} />
              <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                VeriCred
              </span>
              <Badge className="bg-purple-600/15 text-purple-400 border-purple-700/40">
                Beta
              </Badge>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center">
              <div className="relative flex items-center gap-1 bg-black/[0.04] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-1">
                {links.map((l) => (
                  <div key={l.href} className="relative">
                    {isActive(l.href) && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-xl bg-white/70 dark:bg-white/10 shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <Link
                      href={l.href}
                      className="relative z-10 px-3 py-2 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </div>
                ))}
              </div>
            </nav>

            {/* Right: wallet + hamburger */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <WalletStatus
                  userProfile={userProfile}
                  onDisconnect={handleDisconnect}
                  showRoleBadge={false}
                />
              </div>

              <button
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((s) => !s)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                {menuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="fixed right-0 top-0 bottom-0 z-50 w-72 sm:w-80 supports-[backdrop-filter]:backdrop-blur bg-white/80 dark:bg-gray-900/80 border-l border-black/10 dark:border-white/10 shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-black/10 dark:border-white/10">
                <Link
                  href="/home"
                  className="flex items-center gap-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <Logo size="sm" showText={false} />
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    VeriCred
                  </span>
                </Link>
                <button
                  aria-label="Close"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <nav className="px-3 py-4">
                <ul className="space-y-1">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                          isActive(l.href)
                            ? "bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white"
                            : "text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10"
                        }`}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t border-black/10 dark:border-white/10 pt-4">
                  <WalletStatus
                    userProfile={userProfile}
                    onDisconnect={() => {
                      setMenuOpen(false);
                      handleDisconnect();
                    }}
                    showRoleBadge={false}
                  />
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
