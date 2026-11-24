'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Lock,
  ArrowUpRight,
  Plane,
  ShoppingBag,
  Utensils,
  BookOpen,
  Clock,
  ExternalLink,
  Briefcase,
  Sparkles,
  Receipt
} from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';

export interface CheckoutWorkflowData {
  domain: 'travel' | 'shopping' | 'food' | 'research' | 'career';
  title: string;
  subtitle: string;
  priceFormatted: string;
  priceNumber: number;
  savingsFormatted?: string;
  merchantName: string;
  merchantUrl: string;
  merkleRoot: string;
  details: {
    label: string;
    value: string;
  }[];
}

interface CheckoutVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CheckoutWorkflowData | null;
}

export function CheckoutVaultModal({ isOpen, onClose, data }: CheckoutVaultModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(899); // 14:59 minutes

  // Countdown timer for seat / inventory hold
  useEffect(() => {
    if (!isOpen) {
      setIsPaid(false);
      setIsProcessing(false);
      setSecondsRemaining(899);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleAuthorizePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
    }, 1400);
  };

  const getDomainIcon = () => {
    switch (data.domain) {
      case 'travel':
        return <Plane className="w-5 h-5 text-emerald-400" />;
      case 'shopping':
        return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case 'food':
        return <Utensils className="w-5 h-5 text-emerald-400" />;
      case 'research':
        return <BookOpen className="w-5 h-5 text-emerald-400" />;
      case 'career':
        return <Briefcase className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border-2 border-zinc-800 bg-zinc-950 text-white shadow-2xl overflow-hidden">
        <BorderBeam size={220} duration={5} colorFrom="#10b981" colorTo="#00f0ff" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700">
              {getDomainIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-bold text-base text-white">
                  1-Click Autonomous Checkout Vault
                </h3>
                <span className="rounded bg-emerald-950/80 border border-emerald-700 px-2 py-0.5 text-[10px] font-mono uppercase text-emerald-400">
                  Armed
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                Prefilled by GhostBrowser &bull; Bypassed 47 form fields
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {isPaid ? (
            /* Successful Payment Confirmation View */
            <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                  Payment Authorized &bull; Zero Manual Input
                </span>
                <h2 className="text-2xl font-bold font-sans text-white">
                  Reservation Confirmed!
                </h2>
                <p className="text-sm text-zinc-400 max-w-sm">
                  {data.domain === 'travel' && 'Seat 14A has been locked with IndiGo. Ticket and boarding pass dispatched to your registered address.'}
                  {data.domain === 'shopping' && 'Order placed on Flipkart with ₹4,500 bank discount applied. Delivery scheduled for tomorrow.'}
                  {data.domain === 'food' && 'Order sent to restaurant kitchen. Live tracking link dispatched with 25-minute ETA.'}
                  {data.domain === 'research' && 'Verified arXiv paper synthesized. Full markdown & canonical citations cached.'}
                </p>
              </div>

              {/* Receipt Specs Card */}
              <div className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>TRANSACTION HASH</span>
                  <span className="text-emerald-400">0x7f9a...3c21 (SUCCESS)</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>AMOUNT CHARGED</span>
                  <span className="font-bold text-white">{data.priceFormatted}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>MERKLE ROOT</span>
                  <span className="text-zinc-400">{data.merkleRoot.slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>PNR / ORDER ID</span>
                  <span className="text-white font-bold">GB-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                </div>
              </div>

              <div className="w-full flex items-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition"
                >
                  Done
                </button>
                <a
                  href={data.merchantUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <span>Launch Merchant Webpage</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            /* Active Pre-filled Checkout View */
            <>
              {/* Hold Timer Banner */}
              <div className="flex items-center justify-between rounded-xl bg-emerald-950/40 border border-emerald-800/80 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-sans">
                  <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>
                    <strong>Inventory Locked:</strong> GhostBrowser holding price & seat
                  </span>
                </div>
                <div className="font-mono text-sm font-bold text-emerald-400">
                  {timeFormatted}
                </div>
              </div>

              {/* Order / Booking Summary Header */}
              <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-zinc-400">
                      {data.merchantName}
                    </span>
                    <h4 className="text-lg font-bold font-sans text-white">
                      {data.title}
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans mt-0.5">
                      {data.subtitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-sans text-white">
                      {data.priceFormatted}
                    </span>
                    {data.savingsFormatted && (
                      <span className="block text-[11px] font-mono text-emerald-400">
                        Saved {data.savingsFormatted}
                      </span>
                    )}
                  </div>
                </div>

                {/* Prefilled Fields Details Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 font-sans text-xs">
                  {data.details.map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 font-mono block">
                        {item.label}
                      </span>
                      <span className="font-semibold text-zinc-200">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-300 font-sans">
                  Select Instant Payment Intent
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-sans transition ${
                      paymentMethod === 'upi'
                        ? 'border-emerald-500 bg-emerald-950/20 text-white font-semibold'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>UPI Instant Scan</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-sans transition ${
                      paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-950/20 text-white font-semibold'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Apple Pay / Card</span>
                  </button>
                </div>

                {paymentMethod === 'upi' ? (
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-zinc-300 block">
                        UPI ID: <strong className="text-white">ghostbrowse@axisbank</strong>
                      </span>
                      <p className="text-[11px] text-zinc-500 font-sans">
                        Zero OTP required &bull; Signed with W3C C14N Merkle Proof
                      </p>
                    </div>
                    {/* Simulated Clean Stylized QR Code Box */}
                    <div className="w-16 h-16 rounded-lg bg-white p-1.5 flex items-center justify-center shrink-0">
                      <div className="w-full h-full border-2 border-black grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 bg-black">
                        <div className="bg-white rounded-xs" />
                        <div className="bg-black" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-black" />
                        <div className="bg-white" />
                        <div className="bg-black" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-black" />
                        <div className="bg-white rounded-xs" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-mono">Authed Card: &bull;&bull;&bull;&bull; 4242</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        BIOMETRIC READY
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 font-sans">
                      Holder: Vivek D. &bull; Exp: 12/28 &bull; CVV: Auto-filled by Vault
                    </div>
                  </div>
                )}
              </div>

              {/* Security Seal */}
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-900 pt-2">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>W3C C14N CANONICAL VALIDATED</span>
                </div>
                <span>ROOT: {data.merkleRoot.slice(0, 10)}...</span>
              </div>

              {/* 1-Click Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleAuthorizePayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs sm:text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'Authorizing via Steel.dev CDP...'
                      : `Authorize 1-Click Pay (${data.priceFormatted})`}
                  </span>
                </button>

                {/* Secondary Button to optionally view the merchant page */}
                <div className="flex items-center justify-between px-1">
                  <a
                    href={data.merchantUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 font-sans flex items-center gap-1 transition"
                  >
                    <span>View raw merchant page on {data.merchantName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[11px] text-zinc-600 font-mono">
                    Zero manual form fields
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
