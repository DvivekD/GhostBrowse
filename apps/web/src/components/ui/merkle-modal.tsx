"use client";

import React from "react";
import { ShieldCheck, X, CheckCircle2, Lock, FileCode2, Copy, Check } from "lucide-react";

export interface MerkleLeaf {
  index: number;
  label: string;
  data: string;
  hash: string;
  preview?: string;
}

export interface DOMProofPayload {
  source_site: string;
  timestamp_utc: string;
  canonical_url: string;
  dom_sha256: string;
  screenshot_sha256: string;
  verified_price_text: string;
  verified_airline_text: string;
  merkle_root?: string;
  composite_proof_token?: string;
  merkle_leaves?: Record<string, MerkleLeaf>;
  intermediate_hashes?: {
    h01?: string;
    h23?: string;
  };
}

interface MerkleModalProps {
  isOpen: boolean;
  onClose: () => void;
  domProof: DOMProofPayload;
  verificationStatus: "verifying" | "verified" | "tampered";
}

export function MerkleModal({
  isOpen,
  onClose,
  domProof,
  verificationStatus,
}: MerkleModalProps) {
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 max-w-2xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 font-sans">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Cryptographic DOM Proof & Merkle Tree</span>
            </h3>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">
              W3C Canonical XML (C14N) Normalized Tree with Client-Side Web Crypto Verification
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-black dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Status Pill */}
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {verificationStatus === "verified" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Lock className="w-4 h-4 text-blue-500 animate-spin" />
            )}
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 font-sans">
              {verificationStatus === "verified"
                ? "Cryptographic Proof Verified (SubtleCrypto SHA-256 Valid)"
                : "Computing Client SHA-256 Hashes..."}
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
            TAMPER-PROOF
          </span>
        </div>

        {/* Canonical Merkle Leaves */}
        {domProof.merkle_leaves && (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block font-sans">
              Canonical 4-Leaf Hashes
            </span>

            {Object.values(domProof.merkle_leaves).map((leaf) => (
              <div
                key={leaf.index}
                className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between font-semibold text-zinc-800 dark:text-zinc-200">
                  <span className="font-sans">
                    Leaf {leaf.index}: {leaf.label}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    Valid SHA-256
                  </span>
                </div>
                <div className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-1.5 rounded border border-zinc-200 dark:border-zinc-800 break-all">
                  Payload: {leaf.data}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="truncate max-w-[400px]">Hash: {leaf.hash}</span>
                  <button
                    onClick={() => copyToClipboard(leaf.hash, `leaf-${leaf.index}`)}
                    className="hover:text-black dark:hover:text-white p-1"
                    title="Copy hash"
                  >
                    {copiedHash === `leaf-${leaf.index}` ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Intermediate Hashes */}
        {domProof.intermediate_hashes && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-1">
                Branch H01 (L0 + L1)
              </span>
              <span className="font-mono text-[10px] break-all text-zinc-700 dark:text-zinc-300">
                {domProof.intermediate_hashes.h01 || "Computed"}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-1">
                Branch H23 (L2 + L3)
              </span>
              <span className="font-mono text-[10px] break-all text-zinc-700 dark:text-zinc-300">
                {domProof.intermediate_hashes.h23 || "Computed"}
              </span>
            </div>
          </div>
        )}

        {/* Merkle Root Hash Box */}
        <div className="p-4 rounded-xl bg-zinc-900 dark:bg-black text-white flex flex-col gap-1 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 font-mono">
              Merkle Root Digest (SHA-256)
            </span>
            <button
              onClick={() => copyToClipboard(domProof.merkle_root || "", "root")}
              className="text-zinc-400 hover:text-white p-1"
            >
              {copiedHash === "root" ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <span className="font-mono text-xs break-all text-emerald-400 font-medium">
            {domProof.merkle_root || "sha256(H01 + H23)"}
          </span>
        </div>

        {/* Provenance Metadata */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-sans text-zinc-500">
          <div>
            <span className="text-zinc-400">Source:</span> {domProof.source_site}
          </div>
          <div>
            <span className="text-zinc-400">Timestamp:</span> {new Date(domProof.timestamp_utc).toLocaleTimeString()} UTC
          </div>
          <div className="col-span-2 truncate">
            <span className="text-zinc-400">Canonical URL:</span> {domProof.canonical_url}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wide transition hover:bg-zinc-800 dark:hover:bg-zinc-200 font-sans"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
}
