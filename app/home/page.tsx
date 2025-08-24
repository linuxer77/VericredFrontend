"use client";

import AuthGuard from "@/components/auth/auth-guard";
import AddressSearch from "@/components/home/address-search";
import VerificationHub from "@/components/home/verification-hub";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type VerificationStatus = "unverified" | "pending" | "verified";
interface UserProfile {
  walletAddress: string;
  role: string;
  name?: string;
  email?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
}

export default function HomePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vericred_wallet");
      if (!raw) return;
      const w = JSON.parse(raw);
      const profile: UserProfile = {
        walletAddress: w.address,
        role: "Individual",
        name: "Anonymous",
        email: "",
        isVerified: false,
        verificationStatus: "unverified",
      };
      setUserProfile(profile);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Ambient gradients */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-28 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-24 h-96 w-96 rounded-full bg-indigo-700/20 blur-[64px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        />

        {/* Header / hero */}
        <header className="border-b border-gray-900/70 bg-gradient-to-b from-gray-950/60 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <motion.h1
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              Verification Home
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-2 text-gray-400 max-w-2xl"
            >
              Look up a wallet to view profile information and minted
              credentials or continue with your verification tasks.
            </motion.p>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-6"
          >
            {/* Address search with new modal UX */}
            <AddressSearch />

            {/* Verification tools */}
            <VerificationHub />
          </motion.section>
        </main>
      </div>
    </AuthGuard>
  );
}
