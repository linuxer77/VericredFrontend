"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Rocket, Landmark, Search, Globe, Sparkles } from "lucide-react";

export default function ExploreSection() {
  return (
    <section
      id="explore"
      className="relative py-16 md:py-24 border-t border-gray-800/80"
    >
      {/* Background accent */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-10 h-56 w-56 rounded-full bg-purple-700/10 blur-3xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-800/60 bg-gray-900/40 px-3 py-1 text-xs text-gray-300 mb-4">
            <Rocket className="h-4 w-4 text-purple-400" />
            Explore
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Discover the Platform
          </h2>
          <p className="text-gray-400 mt-4">
            Browse the tech, components, and real-world applications of
            VeriCred. Below you’ll find an overview, sample text, and
            interactive tabs to learn more about what you can build.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Summary cards */}
          <div className="space-y-4">
            {[
              {
                title: "Verifiable Records",
                icon: Landmark,
                text: "Instant credential verification on-chain with transparent audit trails.",
              },
              {
                title: "Global Reach",
                icon: Globe,
                text: "Portable credentials you control and share anywhere in the world.",
              },
              {
                title: "Searchable",
                icon: Search,
                text: "Quickly find users or universities by address and view status.",
              },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Card className="bg-gray-900/70 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <c.icon className="h-4 w-4 text-purple-400" />
                      {c.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400">
                    {c.text}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right: Tabs with sample text and code */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-900/70 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  Platform Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="bg-gray-900 border border-gray-800">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="sample"
                      className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400"
                    >
                      Sample Text
                    </TabsTrigger>
                    <TabsTrigger
                      value="code"
                      className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400"
                    >
                      Example Code
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="overview"
                    className="mt-4 text-gray-300 space-y-3"
                  >
                    <p>
                      VeriCred leverages ERC-721 NFTs on Ethereum — Sepolia
                      testnet for now; mainnet later — to provide secure,
                      transparent, and instantly verifiable digital credentials.
                      Individuals keep ownership and can share proofs easily;
                      institutions benefit from automation and reduced overhead.
                    </p>
                    <ul className="list-disc ml-6 text-gray-400">
                      <li>Real-time on-chain verification</li>
                      <li>ERC-721-based credentials</li>
                      <li>Issuer and revocation registries</li>
                    </ul>
                  </TabsContent>

                  <TabsContent
                    value="sample"
                    className="mt-4 text-gray-300 space-y-3"
                  >
                    <p>
                      VeriCred: Decentralized Digital Credentials — VeriCred is
                      a cutting-edge platform revolutionizing academic and
                      professional credentialing. It leverages blockchain
                      technology (ERC-721 NFTs on Ethereum — Sepolia testnet
                      now; mainnet later) for secure, transparent, and instantly
                      verifiable digital records of achievements, empowering
                      individuals and streamlining processes for institutions
                      and verifiers.
                    </p>
                    <p className="text-gray-400">
                      Key Features & Benefits: Forgery-Proof Credentials,
                      Instant & Global Verification, Individual Ownership,
                      Reduced Admin Burden, Enhanced Portability.
                    </p>
                    <p className="text-gray-400">
                      Technology Stack — Blockchain: Ethereum (Sepolia now;
                      mainnet later). Smart Contracts: Solidity (ERC-721,
                      IssuerRegistry, RevocationRegistry). Backend: Golang.
                      Frontend: React / Next.js. Database: PostgreSQL. Storage:
                      IPFS / Pinata. Wallets: MetaMask, WalletConnect.
                    </p>
                  </TabsContent>

                  <TabsContent value="code" className="mt-4">
                    <div className="rounded-md border border-gray-800 bg-black p-4 text-xs text-gray-300 overflow-x-auto">
                      <pre className="whitespace-pre">
                        {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract vericredNFT is ERC721URIStorage, Ownable {
    address public owner;
    uint256 public _tokenIds;
    mapping (address => bool) public verifiedOrgs;
    address[] public Orgs;

    // Show only 1–2 functions for brevity
    constructor() ERC721("VeriCred", "VCRED") {}

    function setVerifiedOrg(address org, bool status) external onlyOwner {
        verifiedOrgs[org] = status;
    }
}`}
                      </pre>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                      <Code2 className="h-3.5 w-3.5" />
                      This snippet shows a minimal subset (constructor + one
                      function) from the contract.
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
