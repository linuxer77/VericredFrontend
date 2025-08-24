"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, CheckCircle, AlertCircle, User } from "lucide-react";
import WalletStatus from "@/components/wallet-status";
import UniversitySelector from "@/components/university-selector";
import UniversitySpecificView from "@/components/university-specific-view";
import MintedCredentialsSummary from "@/components/minted-credentials-summary";
import WalletGuard from "@/components/wallet-guard";
import AuthGuard from "@/components/auth/auth-guard";
import { motion } from "framer-motion";
import { getStoredToken, isJwtValid } from "@/components/auth/jwt";
import Logo from "@/components/ui/logo";

interface University {
  id: string;
  name: string;
  logo: string;
  walletAddress: string;
  verified: boolean;
  description?: string;
  website?: string;
  adminName?: string;
  adminRole?: string;
  banner?: string;
}

interface Credential {
  id: string;
  name: string;
  issueDate: string;
  universityId: string;
  universityName: string;
  status: "eligible" | "pending" | "minted" | "rejected";
  description?: string;
}

interface UserProfile {
  role: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  student_id?: string;
}

export default function StudentDashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [mintedCredentials, setMintedCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // New: track 404 state
  const [notFound, setNotFound] = useState(false);
  // New: dashboard API response data to display
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const storedWalletRaw = localStorage.getItem("vericred_wallet");
        if (!storedWalletRaw) {
          setProfileLoading(false);
          setLoading(false);
          return;
        }
        const walletData = JSON.parse(storedWalletRaw);
        setWalletAddress(walletData?.address || null);

        const localUserRaw = localStorage.getItem("vericred_user");
        if (localUserRaw) {
          const localUser = JSON.parse(localUserRaw);
          setUserProfile({
            role: localUser.role || "Individual",
            first_name: localUser.first_name,
            last_name: localUser.last_name,
            email: localUser.email,
            student_id: localUser.student_id,
          });
          setProfileLoading(false);
          setLoading(false);
          return;
        }

        const token = getStoredToken();
        if (isJwtValid(token)) {
          // Mirror the university fetch logic: call the students endpoint with the token
          const res = await fetch(
            "https://erired-harshitg7062-82spdej3.leapcell.dev/students",
            {
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            }
          );

          // Explicit 404 handling: show CTA instead of redirecting
          if (res.status === 404) {
            setNotFound(true);
            setProfileLoading(false);
            setLoading(false);
            return;
          }

          if (res.ok) {
            const student = await res.json();
            // Backend may return an object or array; handle both
            const me = Array.isArray(student)
              ? student[0] || {}
              : student || {};
            setUserProfile({
              role: me.role || "Individual",
              first_name: me.first_name,
              last_name: me.last_name,
              email: me.email,
              student_id: me.student_id,
            });
          } else {
            setError(`Failed to load profile: ${res.status}`);
          }
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError("Failed to load profile");
      } finally {
        setProfileLoading(false);
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!userProfile) return;
    const mockMintedCredentials: Credential[] = [
      {
        id: "1",
        name: "High School Diploma",
        issueDate: "2020-06-15",
        universityId: "hs1",
        universityName: "Lincoln High School",
        status: "minted",
      },
      {
        id: "2",
        name: "Certificate in Web Development",
        issueDate: "2022-03-20",
        universityId: "cert1",
        universityName: "Tech Academy",
        status: "minted",
      },
    ];
    setMintedCredentials(mockMintedCredentials);
  }, [userProfile]);

  const handleUniversitySelect = async (university: University) => {
    setSelectedUniversity(university);
    setLoading(true);
    setError(null);

    try {
      const mockCredentials: Credential[] = [
        {
          id: "3",
          name: "Bachelor of Science in Computer Science",
          issueDate: "2024-05-15",
          universityId: university.id,
          universityName: university.name,
          status: "eligible",
          description: "4-year undergraduate degree program",
        },
        {
          id: "4",
          name: "Dean's List Recognition - Fall 2023",
          issueDate: "2023-12-20",
          universityId: university.id,
          universityName: university.name,
          status: "pending",
          description: "Academic achievement recognition",
        },
      ];

      setTimeout(() => {
        setCredentials(mockCredentials);
        setLoading(false);
      }, 900);
    } catch (err) {
      setError("Failed to fetch credentials from university");
      setLoading(false);
    }
  };

  const handleDisconnectWallet = () => {
    localStorage.removeItem("vericred_wallet");
    setUserProfile(null);
    setSelectedUniversity(null);
    setCredentials([]);
    setMintedCredentials([]);
    window.location.href = "/";
  };

  // Always fetch /dashboard on visit and show JSON in Profile Summary
  useEffect(() => {
    (async () => {
      try {
        setDashboardError(null);
        // Try to get metamask address from state or localStorage
        let addr = walletAddress;
        if (!addr) {
          try {
            const raw = localStorage.getItem("vericred_wallet");
            if (raw) addr = JSON.parse(raw)?.address || null;
          } catch {}
        }

        const token = getStoredToken();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(addr ? { "x-metamask-address": String(addr) } : {}),
        };

        const base =
          "https://erired-harshitg7062-82spdej3.leapcell.dev/dashboard";
        const url = new URL(base);
        if (addr) {
          url.searchParams.set("metamaskAddress", String(addr));
          url.searchParams.set("metamask_address", String(addr));
        }

        const res = await fetch(url.toString(), {
          method: "GET",
          headers,
        });
        const text = await res.text();
        const json = text
          ? (() => {
              try {
                return JSON.parse(text);
              } catch {
                return { raw: text };
              }
            })()
          : {};
        if (!res.ok) {
          setDashboardError(`Dashboard fetch failed (${res.status})`);
        }
        setDashboardData(json);
      } catch (e: any) {
        setDashboardError(e?.message || "Failed to fetch dashboard");
        setDashboardData(null);
      }
    })();
  }, [walletAddress]);

  if (profileLoading) {
    return (
      <AuthGuard>
        <WalletGuard>
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your profile...</p>
            </div>
          </div>
        </WalletGuard>
      </AuthGuard>
    );
  }

  // New: show friendly CTA when no student account exists
  if (notFound) {
    return (
      <AuthGuard>
        <WalletGuard>
          <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <Card className="w-full max-w-xl bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  No Student Account Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  We couldn’t find a student profile associated with your
                  wallet. Please create your individual account to continue.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-white text-black hover:bg-gray-100"
                    onClick={() => (window.location.href = "/role-selection")}
                  >
                    Create Individual Account
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => (window.location.href = "/home")}
                  >
                    Go to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </WalletGuard>
      </AuthGuard>
    );
  }

  if (!userProfile) {
    return (
      <AuthGuard>
        <WalletGuard>
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <Card className="w-full max-w-md bg-gray-900 border-gray-800">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-white">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  Profile Load Error
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-sm text-gray-400">
                  Unable to load your profile. Please try reconnecting your
                  wallet.
                </p>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="w-full bg-white text-black hover:bg-gray-100"
                >
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </WalletGuard>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <WalletGuard>
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -left-24 h-80 w-80 rounded-full bg-purple-800/20 blur-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, ease: "easeOut", delay: 0.1 }}
          />

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2 backdrop-blur-sm"
              >
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-300">{error}</p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Left Column - University Selection & View */}
              <div className="lg:col-span-7 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <UniversitySelector
                    onUniversitySelect={handleUniversitySelect}
                    selectedUniversity={selectedUniversity}
                  />
                </motion.div>

                {selectedUniversity ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 }}
                  >
                    <UniversitySpecificView
                      university={selectedUniversity}
                      credentials={credentials}
                      loading={loading}
                      userProfile={userProfile}
                      onMintRequest={(_id) => {
                        setSuccessMessage(
                          "Mint request submitted successfully! The university will review your request."
                        );
                        setTimeout(() => setSuccessMessage(null), 4000);
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 }}
                  >
                    <Card className="bg-gradient-to-br from-gray-900/90 via-black/80 to-purple-900/20 border border-gray-800/60 backdrop-blur-xl shadow-2xl">
                      <CardContent className="py-12 text-center">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <GraduationCap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-lg font-medium text-white mb-2">
                          Select a University
                        </h3>
                        <p className="text-gray-400">
                          Choose a university above to view your available
                          credentials and request NFT minting.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Right Column - Summary */}
              <div className="space-y-6 lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                >
                  <MintedCredentialsSummary credentials={mintedCredentials} />
                </motion.div>

                {/* Profile Summary with required fields */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 }}
                >
                  <Card className="bg-gradient-to-br from-gray-900/90 via-black/80 to-purple-900/20 border border-gray-800/60 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <User className="h-5 w-5 text-purple-400" />
                        </motion.div>
                        Profile Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          First name:
                        </span>
                        <span className="text-sm font-medium text-white">
                          {userProfile.first_name || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          Last name:
                        </span>
                        <span className="text-sm font-medium text-white">
                          {userProfile.last_name || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Email:</span>
                        <span className="text-sm font-medium text-white">
                          {userProfile.email || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          Student email:
                        </span>
                        <span className="text-sm font-medium text-white">
                          {userProfile.student_id || "—"}
                        </span>
                      </div>
                      <Separator className="bg-gray-800" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Role:</span>
                        <Badge
                          variant="outline"
                          className="border-purple-700 text-purple-300"
                        >
                          {userProfile.role}
                        </Badge>
                      </div>

                      {/* Fetched Dashboard JSON */}
                      <Separator className="bg-gray-800" />
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-white">
                          Fetched Profile JSON
                        </div>
                        {dashboardError && (
                          <div className="text-xs text-red-300">
                            {dashboardError}
                          </div>
                        )}
                        <pre className="max-h-64 overflow-auto rounded-md bg-black/40 border border-gray-800 p-3 text-xs text-gray-200">
                          {JSON.stringify(dashboardData, null, 2) || "{}"}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg flex items-center gap-2 backdrop-blur-sm">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <p className="text-green-300">{successMessage}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </main>
        </div>
      </WalletGuard>
    </AuthGuard>
  );
}
