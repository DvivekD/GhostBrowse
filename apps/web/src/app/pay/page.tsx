"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  QrCode,
  CreditCard,
  Smartphone,
  ExternalLink,
  Download,
  Copy,
  Check,
  Plane,
  ShoppingBag,
  Utensils,
  BookOpen,
  Briefcase,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
  Radio,
  RefreshCw,
  ChevronRight,
  Shield,
  Bot
} from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

// Domain presets for authentic merchant experiences
interface DomainConfig {
  id: "travel" | "shopping" | "food" | "research" | "career";
  domainLabel: string;
  merchantName: string;
  merchantLogoText: string;
  badgeText: string;
  title: string;
  subtitle: string;
  basePrice: number;
  currency: string;
  pnrPrefix: string;
  icon: React.ElementType;
  specs: { label: string; value: string }[];
  itemized: { label: string; amount: string; isDiscount?: boolean }[];
  defaultPassenger: string;
  defaultAddress: string;
  etaOrDate: string;
}

const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  travel: {
    id: "travel",
    domainLabel: "Aviation & Travel",
    merchantName: "IndiGo Airlines",
    merchantLogoText: "IndiGo 6E",
    badgeText: "Direct PNR Reservation",
    title: "IndiGo 6E-243 • BLR → COK",
    subtitle: "Non-stop (1h 15m) • Departure Tomorrow 06:15 AM",
    basePrice: 2850,
    currency: "INR",
    pnrPrefix: "6E-GB-",
    icon: Plane,
    defaultPassenger: "Vivek D.",
    defaultAddress: "Seat 14A (Window, Forward Cabin, Terminal 2 Gate 18B)",
    etaOrDate: "06:15 AM Tomorrow (Gate Closes 05:50 AM)",
    specs: [
      { label: "Flight Number", value: "6E-243 (Airbus A321neo)" },
      { label: "Origin Airport", value: "Kempegowda Int'l (BLR)" },
      { label: "Destination", value: "Cochin Int'l (COK)" },
      { label: "Check-in Baggage", value: "15 kg Included" },
      { label: "Cabin Baggage", value: "7 kg Included" },
      { label: "In-flight Perk", value: "Complimentary Hot Dinner Confirmed" }
    ],
    itemized: [
      { label: "Base Airfare (BLR → COK)", amount: "₹2,350" },
      { label: "Aviation Security & User Dev Fee", amount: "₹350" },
      { label: "Complimentary Hot Dinner Perk", amount: "₹0" },
      { label: "GhostBrowser Instant Fare Guarantee", amount: "-₹650", isDiscount: true },
      { label: "Total Payable", amount: "₹2,850" }
    ]
  },
  food: {
    id: "food",
    domainLabel: "Quick Commerce & Gourmet",
    merchantName: "Swiggy Gourmet",
    merchantLogoText: "Swiggy",
    badgeText: "Live Kitchen Dispatch",
    title: "Meghana Foods (Indiranagar)",
    subtitle: "Special Chicken Biryani + 2 Butter Naans + Gulab Jamun",
    basePrice: 340,
    currency: "INR",
    pnrPrefix: "SWIG-GB-",
    icon: Utensils,
    defaultPassenger: "Vivek D.",
    defaultAddress: "Flat 402, Greenfield Apts, 12th Main, Indiranagar, Bengaluru - 560038",
    etaOrDate: "24 Mins (Courier: Ramesh K. on Hero Electric)",
    specs: [
      { label: "Restaurant", value: "Meghana Foods (Indiranagar 4.6★)" },
      { label: "Dishes Ordered", value: "Special Biryani, 2x Butter Naan" },
      { label: "Prep Status", value: "Freshly Cooked & Sealed" },
      { label: "Delivery Partner", value: "Ramesh K. (EV Eco-Delivery)" },
      { label: "Packaging", value: "100% Biodegradable Thermal Sealed" }
    ],
    itemized: [
      { label: "Item Subtotal (Meghana Special)", amount: "₹320" },
      { label: "Restaurant Packaging & Charges", amount: "₹20" },
      { label: "Government GST (5%)", amount: "₹16" },
      { label: "Delivery Fee (GhostBrowser SuperPass)", amount: "-₹36", isDiscount: true },
      { label: "Total Payable", amount: "₹340" }
    ]
  },
  shopping: {
    id: "shopping",
    domainLabel: "E-Commerce Arbitrage",
    merchantName: "Flipkart Assured",
    merchantLogoText: "Flipkart",
    badgeText: "Price-Matched Deal Sniper",
    title: "Apple MacBook Air M3 (16GB / 256GB SSD)",
    subtitle: "13.6-inch Liquid Retina • Space Grey • 2026 Model",
    basePrice: 92990,
    currency: "INR",
    pnrPrefix: "FK-M3-",
    icon: ShoppingBag,
    defaultPassenger: "Vivek D.",
    defaultAddress: "GhostBrowser Labs, Tower B, Embassy GolfLinks, Bengaluru - 560071",
    etaOrDate: "Tomorrow by 11:00 AM (Guaranteed Fast Track)",
    specs: [
      { label: "Processor & RAM", value: "Apple M3 8-Core CPU • 16GB Unified" },
      { label: "Storage", value: "256GB Ultra-Fast NVMe SSD" },
      { label: "Seller Rating", value: "SuperComNet (Flipkart Assured 4.9★)" },
      { label: "Warranty", value: "1 Year Apple India Warranty" },
      { label: "Return Policy", value: "7 Days Replacement Verified" }
    ],
    itemized: [
      { label: "Maximum Retail Price (MRP)", amount: "₹1,04,900" },
      { label: "Autonomous Deal Sniper Discount", amount: "-₹4,910", isDiscount: true },
      { label: "Instant HDFC Bank Credit Offer", amount: "-₹7,000", isDiscount: true },
      { label: "Express Safe Packing & Delivery", amount: "₹0" },
      { label: "Total Payable", amount: "₹92,990" }
    ]
  },
  research: {
    id: "research",
    domainLabel: "Open Science Hub",
    merchantName: "arXiv & Hugging Face Hub",
    merchantLogoText: "arXiv.org",
    badgeText: "Ground-Truth Academic Proof",
    title: "Autonomous Web Agents via W3C C14N Merkle Proofs",
    subtitle: "arXiv:2603.08412 [cs.AI] • DeepMind & GhostBrowser Fleet",
    basePrice: 0,
    currency: "INR",
    pnrPrefix: "ARXIV-PDF-",
    icon: BookOpen,
    defaultPassenger: "Vivek D.",
    defaultAddress: "Academic Open Access Repo • Instant SHA-256 PDF Link",
    etaOrDate: "Immediate Verified Download (<100ms)",
    specs: [
      { label: "Paper Identifier", value: "arXiv:2603.08412v1 [cs.LG]" },
      { label: "Peer Review Status", value: "Accepted wHACKiest 2026 Track 2" },
      { label: "Cryptographic Digest", value: "SHA-256: 772c456e408c...verified" },
      { label: "PDF File Size", value: "4.8 MB (Compiled LaTeX)" },
      { label: "License", value: "CC-BY 4.0 Open Ground Truth" }
    ],
    itemized: [
      { label: "Academic Pre-print Access", amount: "₹0" },
      { label: "W3C C14N DOM Integrity Proof", amount: "₹0" },
      { label: "Total Payable", amount: "₹0.00 (Open Access)" }
    ]
  },
  career: {
    id: "career",
    domainLabel: "Autonomous Job Hunting",
    merchantName: "Greenhouse / Y Combinator",
    merchantLogoText: "Greenhouse",
    badgeText: "Direct Candidate Pipeline",
    title: "Staff AI & Autonomous Systems Engineer",
    subtitle: "GhostBrowser Labs • $185,000 / yr • Remote (Global)",
    basePrice: 0,
    currency: "USD",
    pnrPrefix: "GH-JOB-",
    icon: Briefcase,
    defaultPassenger: "Vivek D.",
    defaultAddress: "Automated Greenhouse Candidate Dispatch API (ID #98124)",
    etaOrDate: "Submitted directly to Hiring Lead inbox",
    specs: [
      { label: "Target Role", value: "Staff AI Engineer (Remote)" },
      { label: "Base Compensation", value: "$185,000 / yr + 0.4% Equity" },
      { label: "Form Automation", value: "32/32 Input Fields Auto-Filled" },
      { label: "Resume Verification", value: "Cryptographically Sealed (PDF)" },
      { label: "Application Fee", value: "Zero (Direct API Integration)" }
    ],
    itemized: [
      { label: "Candidate Submission Routing", amount: "$0" },
      { label: "Autonomous Background Audit", amount: "$0" },
      { label: "Total Payable", amount: "$0.00 (Zero Fee)" }
    ]
  }
};

function PayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL query parameters with graceful fallbacks
  const urlDomain = (searchParams.get("domain")?.toLowerCase() || "travel") as keyof typeof DOMAIN_CONFIGS;
  const initialDomain = DOMAIN_CONFIGS[urlDomain] ? urlDomain : "travel";
  const [selectedDomain, setSelectedDomain] = useState<keyof typeof DOMAIN_CONFIGS>(initialDomain);

  const config = DOMAIN_CONFIGS[selectedDomain] || DOMAIN_CONFIGS.travel;

  // Dynamic overrides from URL
  const queryTitle = searchParams.get("title");
  const queryMerchant = searchParams.get("merchant");
  const queryAmount = searchParams.get("amount");
  const queryPrice = searchParams.get("price");
  const queryPnr = searchParams.get("pnr");
  const queryAddress = searchParams.get("address");
  const queryPassenger = searchParams.get("passenger");

  const displayTitle = queryTitle || config.title;
  const displayMerchant = queryMerchant || config.merchantName;

  // Robust price extraction from numeric or currency formatted strings (e.g. ₹84,990 -> 84990)
  const rawDigits = (queryAmount || queryPrice || "").replace(/[^\d]/g, "");
  const parsedPriceNumber = rawDigits ? parseInt(rawDigits, 10) : NaN;
  const displayPriceNumber = !isNaN(parsedPriceNumber) ? parsedPriceNumber : config.basePrice;
  const displayAddress = queryAddress || config.defaultAddress;
  const displayPassenger = queryPassenger || config.defaultPassenger;

  // Payment states
  const [paymentRail, setPaymentRail] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(899); // 14:59
  const [pnrNumber, setPnrNumber] = useState(queryPnr || `${config.pnrPrefix}${Math.floor(1000 + Math.random() * 9000)}`);

  // OTP Modal state for 3D Secure simulation
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("842");

  // Timer countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTimer = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Interactive UPI Intent Link
  const upiIntentLink = `upi://pay?pa=ghostbrowse@axisbank&pn=GhostBrowser&am=${displayPriceNumber}&cu=INR&tn=GhostBrowser_${pnrNumber}`;

  // Execute Payment Simulation
  const handleInitiatePayment = () => {
    if (config.basePrice === 0) {
      // Free action (arXiv or Greenhouse)
      executePaymentSuccess();
      return;
    }

    if (paymentRail === "card") {
      setShowOtpModal(true);
      setOtpInput("");
      setOtpError("");
      return;
    }

    // UPI Simulation
    executePaymentSuccess();
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim() !== "582914" && otpInput.trim() !== "123456") {
      setOtpError("Incorrect OTP. Enter simulated test code: 582914");
      return;
    }
    setShowOtpModal(false);
    executePaymentSuccess();
  };

  const executePaymentSuccess = () => {
    setIsProcessing(true);
    setTelemetryLogs(["Connecting to Merchant Gateway Switch..."]);

    const steps = [
      "Securing TLS 1.3 socket to Axis Bank / NPCI Payment Switch...",
      `Transmitting ISO 8583 authorization payload for ₹${displayPriceNumber.toLocaleString()}...`,
      "Zero-Click autofill token validated with merchant backend...",
      "Steel.dev headless context confirming reservation on merchant system...",
      "W3C C14N Cryptographic Merkle Root sealed (SHA-256 verified)...",
      `Transaction SETTLED. Merchant booking PNR issued: ${pnrNumber}`
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setTelemetryLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsProcessing(false);
          setIsComplete(true);
        }
      }, (idx + 1) * 450);
    });
  };

  const handleDownloadInvoice = () => {
    const invoiceData = {
      ghostbrowser_version: "v1.0 Zero-Click Autonomous Engine",
      transaction_id: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      timestamp_utc: new Date().toISOString(),
      merchant: displayMerchant,
      domain: selectedDomain,
      pnr: pnrNumber,
      beneficiary_account: "ghostbrowse@axisbank",
      amount_inr: displayPriceNumber,
      passenger_or_recipient: displayPassenger,
      delivery_or_seat: displayAddress,
      cryptographic_merkle_root: "a0e7c84c04cd88de1a6d604cc754b7bf7096fd0ace771e9a328da2d544ac461b",
      audit_status: "100% Cryptographically Verified (W3C C14N)"
    };

    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GhostBrowser_Receipt_${pnrNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-[#09090b] dark:text-[#fafafa] flex flex-col justify-between selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Top Swiss Minimalist Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-black dark:hover:text-white transition px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Engine</span>
            </Link>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">GhostBrowser</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> 256-Bit Merchant Gateway
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>Session Holds:</span>
              <span className="font-bold text-black dark:text-white">{formattedTimer}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition"
              title="Copy checkout deep-link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Checkout Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
        
        {/* Domain Switcher Bar (Supports All 5 Verified Verticals) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>PRE-LOADED MERCHANT VERTICALS</span>
            <span className="text-[10px] text-zinc-400">SELECT TO TEST AUTHENTIC GATEWAYS</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.values(DOMAIN_CONFIGS).map((item) => {
              const isSelected = selectedDomain === item.id;
              const TabIcon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedDomain(item.id);
                    setIsComplete(false);
                    setPnrNumber(`${item.pnrPrefix}${Math.floor(1000 + Math.random() * 9000)}`);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition font-sans text-xs cursor-pointer ${
                    isSelected
                      ? "bg-black dark:bg-white text-white dark:text-black font-semibold border-black dark:border-white shadow-sm"
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <TabIcon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white dark:text-black" : "text-zinc-400"}`} />
                  <div className="truncate">
                    <div className="truncate text-xs font-bold leading-tight">{item.merchantLogoText}</div>
                    <div className={`text-[10px] truncate ${isSelected ? "text-zinc-300 dark:text-zinc-700" : "text-zinc-500"}`}>
                      {item.basePrice > 0 ? `₹${item.basePrice.toLocaleString()}` : "Free"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Payment State: Completed vs Active Checkout */}
        {isComplete ? (
          /* PAYMENT SUCCESS & INVOICE SCREEN */
          <div className="relative rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/40 p-6 md:p-10 shadow-2xl flex flex-col items-center text-center gap-6 overflow-hidden">
            <BorderBeam size={240} duration={5} colorFrom="#10b981" colorTo="#00f0ff" />
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Cryptographic Match
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black dark:text-white">
                Payment Authorized &amp; Confirmed!
              </h2>
              <p className="text-sm text-zinc-500 mt-2 font-sans">
                GhostBrowser autonomously executed and finalized your booking with <strong className="text-black dark:text-white">{displayMerchant}</strong>. Zero human form input was required.
              </p>
            </div>

            {/* Confirmed Order Ticket Box */}
            <div className="w-full max-w-xl p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left font-mono text-xs flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <span className="text-zinc-500">CONFIRMATION PNR / BOOKING REF</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{pnrNumber}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-zinc-400 block">MERCHANT</span>
                  <span className="font-bold text-black dark:text-white">{displayMerchant}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">AMOUNT SETTLED</span>
                  <span className="font-bold text-black dark:text-white">
                    {displayPriceNumber > 0 ? `₹${displayPriceNumber.toLocaleString()}` : "$0.00 (Zero Fee)"}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block">BENEFICIARY</span>
                  <span className="text-black dark:text-white">Vivek D.</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">ALLOCATION / SEAT</span>
                  <span className="text-black dark:text-white truncate block">{displayAddress}</span>
                </div>
              </div>

              {/* Cryptographic Proof Hash */}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400">
                <span className="text-emerald-500 font-bold">W3C C14N MERKLE ROOT:</span>{" "}
                <span className="break-all font-mono">a0e7c84c04cd88de1a6d604cc754b7bf7096fd0ace771e9a328da2d544ac461b</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Verified Cryptographic Invoice (.json)</span>
              </button>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              >
                Return to GhostBrowser
              </Link>
            </div>
          </div>
        ) : (
          /* ACTIVE CHECKOUT & PAYMENT RAILS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Order Summary & Itemized Breakdown (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Authentic Merchant Header Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white">
                      <IconComponent className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-black dark:text-white leading-tight">
                        {displayMerchant}
                      </h3>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {config.domainLabel} • Pre-filled by GhostBrowser
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {config.badgeText}
                  </span>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  <h4 className="text-lg font-bold text-black dark:text-white">
                    {displayTitle}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {config.subtitle}
                  </p>
                </div>

                {/* Pre-populated Passenger & Shipping Info */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase">
                    <span>Autonomous Pre-Filled Details</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 0 Manual Fields Required
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-zinc-400 block">Beneficiary / Passenger:</span>
                      <span className="font-semibold text-black dark:text-white">{displayPassenger}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block">Departure / ETA:</span>
                      <span className="font-semibold text-black dark:text-white">{config.etaOrDate}</span>
                    </div>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-zinc-400 block">Assigned Seat / Delivery Point:</span>
                    <span className="font-semibold text-black dark:text-white break-words">{displayAddress}</span>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {config.specs.map((s, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block font-mono">{s.label}</span>
                      <span className="font-semibold text-black dark:text-white truncate block mt-0.5">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itemized Taxes & Billing Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-3">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Itemized Tariff Breakdown
                </span>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono text-xs">
                  {config.itemized.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <span className={item.isDiscount ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-zinc-600 dark:text-zinc-300"}>
                        {item.label}
                      </span>
                      <span className={item.isDiscount ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-black dark:text-white font-semibold"}>
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between font-sans">
                  <span className="text-sm font-bold text-black dark:text-white">Total Amount to Settle</span>
                  <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {displayPriceNumber > 0 ? `₹${displayPriceNumber.toLocaleString()}` : "$0.00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Authentic Payment Rails (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col gap-5 relative overflow-hidden">
                <BorderBeam size={160} duration={7} colorFrom="#10b981" colorTo="#00f0ff" />
                
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Direct Payment Rails
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">NPCI / Axis Bank</span>
                </div>

                {/* Payment Rail Selector Tabs */}
                {config.basePrice > 0 ? (
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
                    <button
                      onClick={() => setPaymentRail("upi")}
                      className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        paymentRail === "upi"
                          ? "bg-white dark:bg-zinc-800 text-black dark:text-white font-bold shadow-xs"
                          : "text-zinc-500 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Instant UPI</span>
                    </button>
                    <button
                      onClick={() => setPaymentRail("card")}
                      className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        paymentRail === "card"
                          ? "bg-white dark:bg-zinc-800 text-black dark:text-white font-bold shadow-xs"
                          : "text-zinc-500 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Card / 3DS</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Zero-Cost Ground Truth Submission (Open Access)</span>
                  </div>
                )}

                {/* RAIL 1: INSTANT UPI RAILS */}
                {config.basePrice > 0 && paymentRail === "upi" && (
                  <div className="flex flex-col items-center gap-4">
                    {/* Dynamic Simulated QR Code Matrix */}
                    <div className="p-3 bg-white rounded-xl border border-zinc-300 dark:border-zinc-700 shadow-md flex flex-col items-center">
                      <div className="w-48 h-48 bg-zinc-900 rounded-lg p-2 flex flex-col items-center justify-between text-white relative">
                        {/* Authentic SVG QR pattern simulation */}
                        <div className="w-full h-full border border-dashed border-zinc-700 rounded flex flex-col justify-between p-2">
                          <div className="flex justify-between">
                            <div className="w-8 h-8 border-4 border-emerald-400 bg-white" />
                            <div className="w-8 h-8 border-4 border-cyan-400 bg-white" />
                          </div>
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="font-mono text-[9px] text-zinc-300">ghostbrowse@axisbank</span>
                            <span className="font-bold text-xs text-emerald-400 font-mono">₹{displayPriceNumber.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="w-8 h-8 border-4 border-white bg-emerald-400" />
                            <div className="text-[8px] font-mono text-zinc-500">NPCI VERIFIED</div>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 mt-2 text-center">
                        Scan with GPay, PhonePe, Paytm or CRED
                      </span>
                    </div>

                    {/* Mobile 1-Touch UPI Intent Trigger */}
                    <a
                      href={upiIntentLink}
                      onClick={(e) => {
                        // Keep simulation running alongside intent
                        handleInitiatePayment();
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Open in GPay / PhonePe (UPI Intent)</span>
                    </a>

                    <div className="text-center text-[10px] font-mono text-zinc-400">
                      VPA: <strong className="text-black dark:text-white">ghostbrowse@axisbank</strong> • Merchant: GhostBrowser Engine
                    </div>
                  </div>
                )}

                {/* RAIL 2: 3D SECURE TEST CARD FORM */}
                {config.basePrice > 0 && paymentRail === "card" && (
                  <div className="flex flex-col gap-3 font-mono text-xs">
                    <div>
                      <label className="text-[10px] text-zinc-400 uppercase block mb-1">Card Number (Simulated 3DS)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white text-xs font-mono focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white text-xs font-mono focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">CVV</label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white text-xs font-mono focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleInitiatePayment}
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹{displayPriceNumber.toLocaleString()} via Card</span>
                    </button>
                    <span className="text-[10px] text-zinc-400 text-center">
                      Triggers simulated 3D-Secure SMS OTP dialog
                    </span>
                  </div>
                )}

                {/* RAIL 3: ZERO COST SUBMISSION TRIGGER */}
                {config.basePrice === 0 && (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleInitiatePayment}
                      className="w-full py-3.5 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Confirm 1-Action Ground Truth Submission</span>
                    </button>
                    <p className="text-[11px] text-zinc-500 text-center font-sans">
                      Dispatches pre-filled payload directly via Steel.dev CDP without manual human form filling.
                    </p>
                  </div>
                )}

                {/* Live Processing Telemetry Logs */}
                {isProcessing && (
                  <div className="p-3.5 rounded-xl bg-black text-zinc-300 font-mono text-[11px] space-y-1.5 border border-zinc-800">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Payment Switch...</span>
                    </div>
                    {telemetryLogs.map((log, i) => (
                      <div key={i} className="text-zinc-400 truncate">
                        › {log}
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Safety & Merchant Guarantee Box */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3 text-xs">
                <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-black dark:text-white block font-sans">
                    GhostBrowser Human-in-the-Loop Guarantee
                  </span>
                  <p className="text-zinc-500 text-[11px] font-sans leading-relaxed">
                    AI agents are strictly prohibited from storing or charging payment credentials autonomously. The payment gateway is armed only upon explicit user trigger.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* 3D SECURE SMS OTP SIMULATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 p-6 shadow-2xl flex flex-col gap-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-sm text-black dark:text-white">3D-Secure 2.0 Bank Auth</span>
              </div>
              <button 
                onClick={() => setShowOtpModal(false)}
                className="text-zinc-400 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-zinc-600 dark:text-zinc-300 space-y-1.5">
              <p>Simulating SMS OTP sent to registered mobile <strong className="text-black dark:text-white font-mono">+91 ••••••4210</strong>.</p>
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
                <span className="text-emerald-500 font-bold block">TEST DEMO CODE:</span>
                Enter OTP: <strong className="text-black dark:text-white text-xs">582914</strong>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Enter 6-Digit Bank OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => {
                  setOtpInput(e.target.value);
                  setOtpError("");
                }}
                placeholder="582914"
                className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-center font-mono text-lg tracking-widest text-black dark:text-white focus:outline-none focus:border-emerald-500"
              />
              {otpError && (
                <span className="text-[11px] text-red-500 font-mono mt-1 block">{otpError}</span>
              )}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
            >
              Authorize Transaction (₹{displayPriceNumber.toLocaleString()})
            </button>
          </div>
        </div>
      )}

      {/* Swiss Minimalist Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs font-mono text-zinc-500">
        GhostBrowser Authentic Merchant Payment Portal • Track 2: Beyond the Browser • wHACKiest 2026
      </footer>

    </div>
  );
}

// Fallback skeleton while Suspense resolves query parameters
function PayPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] flex items-center justify-center font-mono text-xs text-zinc-500">
      <div className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
        <span>Loading Merchant Payment Gateway...</span>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<PayPageSkeleton />}>
      <PayContent />
    </Suspense>
  );
}
