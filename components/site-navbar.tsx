"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/logo";
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

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        {/* Glass, rounded pill container (landing style) */}
        <div className="w-full rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_1px_1px_rgba(255,255,255,0.05)] px-3 md:px-4 py-2">
          <div className="flex justify-between items-center gap-3">
            {/* Logo (link to home) */}
            <Link href="/home" className="group flex items-center">
              <Logo
                size="md"
                className="group-hover:scale-105 transition-transform duration-200"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-all"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Desktop Wallet */}
            <div className="hidden md:flex items-center gap-3">
              <WalletStatus
                userProfile={userProfile}
                onDisconnect={handleDisconnect}
                showRoleBadge={false}
              />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((s) => !s)}
                className="inline-flex items-center justify-center p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition"
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
      </nav>

      {/* Mobile Navigation (landing style dropdown) */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/70 backdrop-blur-md">
          <div className="px-3 py-3 space-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
              >
                {l.label}
              </Link>
            ))}

            <div className="border-t border-white/10 pt-3">
              <WalletStatus
                userProfile={userProfile}
                onDisconnect={() => {
                  setMenuOpen(false);
                  handleDisconnect();
                }}
                showRoleBadge={false}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
