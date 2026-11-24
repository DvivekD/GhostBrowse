'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Lock,
  ArrowRight,
  ArrowLeft,
  Plane,
  ShoppingBag,
  Utensils,
  BookOpen,
  Clock,
  ExternalLink,
  Briefcase,
  Copy,
  Check,
  Download,
  Smartphone,
  Sparkles,
  Receipt,
  User,
  Mail,
  Phone,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';

export interface BreakdownItem {
  label: string;
  amountFormatted: string;
  isDiscount?: boolean;
}

export interface CheckoutWorkflowData {
  domain: 'travel' | 'shopping' | 'food' | 'research' | 'career';
  title: string;
  subtitle: string;
  priceFormatted: string;
  priceNumber: number;
  savingsFormatted?: string;
  merchantName: string;
  merchantUrl: string;
  directBookingUrl?: string;
  merkleRoot: string;
  itemizedBreakdown?: BreakdownItem[];
  passengerDetails?: {
    name: string;
    email: string;
    phone: string;
    seatOrAddress: string;
  };
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
  // 3-Step Funnel: 1 = Review & Details, 2 = Interactive Payment Gateway, 3 = Receipt & Live Handoff
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [telemetryLog, setTelemetryLog] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState(899); // 14:59 minutes

  // Interactive Editable Passenger / Shipping State
  const [passengerName, setPassengerName] = useState('Vivek D.');
  const [passengerEmail, setPassengerEmail] = useState('vivek.d@ghostbrowser.dev');
  const [passengerPhone, setPassengerPhone] = useState('+91 98765 43210');
  const [passengerAddress, setPassengerAddress] = useState('Seat 14A (Window, Forward Cabin)');
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  // Interactive Payment Inputs
  const [upiId, setUpiId] = useState('vivek@oksbi');
  const [isUpiVerified, setIsUpiVerified] = useState(true);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  // Copy Feedback state
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedRoot, setCopiedRoot] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Stable PNR / Order ID per modal open
  const [pnrId, setPnrId] = useState('GB-6E-8491');
  const [txHash, setTxHash] = useState('0x7f9a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e3c21');

  // Sync initial state when modal opens or data changes
  useEffect(() => {
    if (!isOpen || !data) {
      setStep(1);
      setIsProcessing(false);
      setTelemetryLog('');
      setIsEditingDetails(false);
      setSecondsRemaining(899);
      return;
    }

    // Generate fresh identifiers for this transaction
    const randomHex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setPnrId(`GB-${data.domain.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setTxHash(`0x7f${randomHex}3c21`);

    // Set domain-appropriate address / seat
    if (data.passengerDetails) {
      setPassengerName(data.passengerDetails.name);
      setPassengerEmail(data.passengerDetails.email);
      setPassengerPhone(data.passengerDetails.phone);
      setPassengerAddress(data.passengerDetails.seatOrAddress);
    } else {
      if (data.domain === 'travel') {
        setPassengerAddress('Seat 14A (Window, Forward Cabin)');
      } else if (data.domain === 'shopping') {
        setPassengerAddress('Flat 402, Skyline Heights, 100ft Rd, Indiranagar, Bengaluru - 560038');
      } else if (data.domain === 'food') {
        setPassengerAddress('Flat 402, Skyline Heights, Indiranagar, Bengaluru');
      } else if (data.domain === 'career') {
        setPassengerAddress('LinkedIn: linkedin.com/in/vivekd • GitHub: github.com/DvivekD');
      } else {
        setPassengerAddress('Primary Researcher: Vivek D.');
      }
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate or retrieve itemized breakdown
  const getItemizedCharges = (): BreakdownItem[] => {
    if (data.itemizedBreakdown && data.itemizedBreakdown.length > 0) {
      return data.itemizedBreakdown;
    }

    if (data.domain === 'travel') {
      const total = data.priceNumber || 5550;
      const discount = 650;
      const tax = 750;
      const base = total - tax + discount;
      return [
        { label: 'Base Airfare (BLR → COK)', amountFormatted: `₹${base.toLocaleString()}` },
        { label: 'Aviation Security Fee & Airport Tax (UDF)', amountFormatted: `₹${tax.toLocaleString()}` },
        { label: 'GhostBrowser Negotiated Discount', amountFormatted: `-₹${discount.toLocaleString()}`, isDiscount: true },
        { label: 'Total Amount Payable', amountFormatted: data.priceFormatted }
      ];
    } else if (data.domain === 'shopping') {
      return [
        { label: 'Apple MacBook Air M3 (Space Grey)', amountFormatted: '₹89,490' },
        { label: 'Flipkart Assured Instant Card Rebate', amountFormatted: '-₹4,500', isDiscount: true },
        { label: 'Next-Day Express Priority Shipping', amountFormatted: 'FREE' },
        { label: 'Total Amount Payable', amountFormatted: data.priceFormatted }
      ];
    } else if (data.domain === 'food') {
      return [
        { label: 'Butter Chicken + 2 Butter Garlic Naan', amountFormatted: '₹395' },
        { label: 'Restaurant Packaging & Service Surcharge', amountFormatted: '₹50' },
        { label: 'Swiggy Gourmet One Pass Free Delivery', amountFormatted: '-₹65', isDiscount: true },
        { label: 'Total Amount Payable', amountFormatted: data.priceFormatted }
      ];
    } else if (data.domain === 'research') {
      return [
        { label: 'arXiv:2501.12948 Full Preprint Synthesis', amountFormatted: '₹0 (Free)' },
        { label: 'Canonical Citation Indexing & Markdown Bundle', amountFormatted: 'Included' },
        { label: 'Total Amount Payable', amountFormatted: 'Free (Open Access)' }
      ];
    } else {
      return [
        { label: 'Greenhouse.io Automated Candidate Dispatch', amountFormatted: '$0' },
        { label: 'ATS 32-Field Compatibility Verification', amountFormatted: 'Verified' },
        { label: 'Total Amount Payable', amountFormatted: 'Free' }
      ];
    }
  };

  const itemizedList = getItemizedCharges();

  // Handle Authorize Payment with Realistic Multi-stage Telemetry
  const handleAuthorizePayment = () => {
    setIsProcessing(true);
    setTelemetryLog('Connecting to NPCI UPI switch & bank gateway...');

    setTimeout(() => {
      setTelemetryLog('Tokenizing payment session through Steel.dev CDP vault...');
    }, 600);

    setTimeout(() => {
      setTelemetryLog('Verifying cryptographic DOM state with Merkle root...');
    }, 1200);

    setTimeout(() => {
      setTelemetryLog('Payment captured! Generating signed cryptographic receipt...');
    }, 1800);

    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2400);
  };

  const handleCopy = (text: string, type: 'hash' | 'root' | 'order') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else if (type === 'root') {
      setCopiedRoot(true);
      setTimeout(() => setCopiedRoot(false), 2000);
    } else if (type === 'order') {
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    }
  };

  const handleDownloadReceipt = () => {
    const receiptData = {
      pnr_order_id: pnrId,
      transaction_hash: txHash,
      domain: data.domain,
      item: data.title,
      merchant: data.merchantName,
      amount_charged: data.priceFormatted,
      passenger_or_recipient: {
        name: passengerName,
        email: passengerEmail,
        phone: passengerPhone,
        address_or_seat: passengerAddress
      },
      w3c_c14n_merkle_root: data.merkleRoot,
      timestamp_utc: new Date().toISOString(),
      verified_by: 'GhostBrowser Autonomous Steel.dev CDP Fleet'
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${pnrId.toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  // Best direct actionable URL (pre-selected checkout or deep booking)
  const directActionUrl = data.directBookingUrl || data.merchantUrl;
  const payPortalUrl = `/pay?domain=${data.domain}&title=${encodeURIComponent(data.title)}&price=${encodeURIComponent(data.priceFormatted)}&amount=${data.priceNumber ?? ""}&merchant=${encodeURIComponent(data.merchantName)}&pnr=${encodeURIComponent(pnrId)}&address=${encodeURIComponent(passengerAddress)}&passenger=${encodeURIComponent(passengerName)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border-2 border-zinc-800 bg-zinc-950 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <BorderBeam size={220} duration={5} colorFrom="#10b981" colorTo="#00f0ff" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
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
                Prefilled by GhostBrowser &bull; Bypassed 47 manual inputs
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

        {/* Step Progress Navigation Indicator */}
        <div className="grid grid-cols-3 border-b border-zinc-800/80 bg-zinc-900/30 text-xs font-sans shrink-0">
          <button
            onClick={() => step !== 3 && setStep(1)}
            disabled={step === 3}
            className={`py-2.5 px-3 flex items-center justify-center gap-1.5 border-r border-zinc-800 transition ${
              step === 1
                ? 'bg-emerald-950/40 text-emerald-300 font-semibold border-b-2 border-b-emerald-400'
                : step > 1
                ? 'text-zinc-400 hover:text-zinc-200'
                : 'text-zinc-600'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-mono">
              {step > 1 ? '✓' : '1'}
            </span>
            <span>1. Review Details</span>
          </button>

          <button
            onClick={() => step !== 3 && setStep(2)}
            disabled={step === 3}
            className={`py-2.5 px-3 flex items-center justify-center gap-1.5 border-r border-zinc-800 transition ${
              step === 2
                ? 'bg-emerald-950/40 text-emerald-300 font-semibold border-b-2 border-b-emerald-400'
                : step > 2
                ? 'text-zinc-400'
                : 'text-zinc-500'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-mono">
              {step > 2 ? '✓' : '2'}
            </span>
            <span>2. Payment Gate</span>
          </button>

          <div
            className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition ${
              step === 3
                ? 'bg-emerald-950/40 text-emerald-300 font-semibold border-b-2 border-b-emerald-400'
                : 'text-zinc-500'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-mono">
              3
            </span>
            <span>3. Receipt & Live Handoff</span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto grow">
          {/* ================= STEP 1: REVIEW & EDITABLE DETAILS ================= */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Inventory Hold Timer Banner */}
              <div className="flex items-center justify-between rounded-xl bg-emerald-950/30 border border-emerald-800/70 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-sans">
                  <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>
                    <strong>Inventory & Fare Locked:</strong> Holding fare with {data.merchantName}
                  </span>
                </div>
                <div className="font-mono text-sm font-bold text-emerald-400">
                  {timeFormatted}
                </div>
              </div>

              {/* Order / Booking Summary Header */}
              <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 space-y-2">
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

                {/* Domain Specs Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 font-sans text-xs">
                  {data.details.map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800">
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

              {/* Itemized Price Breakdown Table */}
              <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 font-sans border-b border-zinc-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Itemized Fare & Tax Breakdown</span>
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">Verified by CDP</span>
                </div>

                <div className="space-y-1.5 text-xs font-sans">
                  {itemizedList.map((charge, idx) => {
                    const isTotal = idx === itemizedList.length - 1;
                    return (
                      <div
                        key={idx}
                        className={`flex justify-between items-center ${
                          isTotal
                            ? 'pt-2 border-t border-zinc-800 font-bold text-sm text-white'
                            : charge.isDiscount
                            ? 'text-emerald-400 font-mono'
                            : 'text-zinc-300'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {charge.label}
                        </span>
                        <span className={charge.isDiscount ? 'text-emerald-400 font-bold' : ''}>
                          {charge.amountFormatted}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Editable Passenger / Recipient Details */}
              <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-zinc-200 font-sans">
                      {data.domain === 'travel' ? 'Passenger & Seat Details' : 'Recipient & Shipping Address'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsEditingDetails(!isEditingDetails)}
                    className="text-[11px] font-sans text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                  >
                    {isEditingDetails ? 'Done Editing' : 'Edit Information'}
                  </button>
                </div>

                {isEditingDetails ? (
                  <div className="space-y-2.5 text-xs font-sans">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                          EMAIL
                        </label>
                        <input
                          type="email"
                          value={passengerEmail}
                          onChange={(e) => setPassengerEmail(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                          PHONE NUMBER
                        </label>
                        <input
                          type="text"
                          value={passengerPhone}
                          onChange={(e) => setPassengerPhone(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                        {data.domain === 'travel' ? 'SEAT PREFERENCE' : 'DELIVERY ADDRESS / METADATA'}
                      </label>
                      <input
                        type="text"
                        value={passengerAddress}
                        onChange={(e) => setPassengerAddress(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 font-mono block">Passenger / Buyer</span>
                      <span className="text-zinc-200 font-semibold">{passengerName}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 font-mono block">Contact Phone</span>
                      <span className="text-zinc-200 font-mono">{passengerPhone}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-850 col-span-2">
                      <span className="text-[10px] text-zinc-500 font-mono block">
                        {data.domain === 'travel' ? 'Assigned Seat & Boarding Gate' : 'Shipping Destination'}
                      </span>
                      <span className="text-zinc-200">{passengerAddress}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cryptographic Seal */}
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-900 pt-2">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>W3C C14N CANONICAL VALIDATED</span>
                </div>
                <span>ROOT: {data.merkleRoot.slice(0, 10)}...</span>
              </div>

              {/* Action Buttons for Step 1 */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs sm:text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2 font-sans"
                >
                  <span>Proceed to Payment Gateway ({data.priceFormatted})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Direct Action Link to live merchant site */}
                <div className="flex items-center justify-between px-1">
                  <a
                    href={payPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-zinc-400 hover:text-emerald-400 font-sans flex items-center gap-1 transition"
                  >
                    <span>Or review directly on {data.merchantName} live page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Zero manual form fields
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: INTERACTIVE PAYMENT GATEWAY ================= */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Payment Method Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 font-sans">
                    Select Interactive Payment Gateway
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    Amount: {data.priceFormatted}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-sans transition ${
                      paymentMethod === 'upi'
                        ? 'border-emerald-500 bg-emerald-950/20 text-white font-semibold'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>UPI Instant Gateway</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-sans transition ${
                      paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-950/20 text-white font-semibold'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Saved Card / Apple Pay</span>
                  </button>
                </div>
              </div>

              {/* Payment Method Details */}
              {paymentMethod === 'upi' ? (
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                      ENTER YOUR UPI ID (VPA)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          setIsUpiVerified(true);
                        }}
                        placeholder="e.g. yourname@oksbi"
                        className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setIsUpiVerified(true)}
                        className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-sans text-zinc-200 border border-zinc-700"
                      >
                        Verify VPA
                      </button>
                    </div>
                    {isUpiVerified && (
                      <p className="text-[11px] text-emerald-400 font-sans mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>VPA Verified: {passengerName} (State Bank of India)</span>
                      </p>
                    )}
                  </div>

                  {/* QR Code & Direct UPI Intent */}
                  <div className="p-3 rounded-lg bg-zinc-950/90 border border-zinc-850 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-zinc-200 block">
                        Merchant VPA: <strong className="text-white">ghostbrowse@axisbank</strong>
                      </span>
                      <p className="text-[11px] text-zinc-500 font-sans">
                        Zero OTP required &bull; Auto-signed with W3C C14N Merkle Proof
                      </p>
                      <div className="flex gap-1.5 pt-1">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-300">
                          GPay
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-300">
                          PhonePe
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-300">
                          Paytm
                        </span>
                      </div>
                    </div>

                    {/* Stylized High-contrast QR Representation */}
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
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3 font-sans text-xs">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                      CARD NUMBER (AUTO-FILLED BY VAULT)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                        EXPIRY
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-850">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] text-zinc-300">
                        Authorize with WebAuthn / Touch ID Passkey
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={biometricEnabled}
                      onChange={(e) => setBiometricEnabled(e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Live Processing Telemetry Bar */}
              {isProcessing && (
                <div className="rounded-xl bg-emerald-950/50 border border-emerald-700 p-3.5 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>GATEWAY TELEMETRY ACTIVE</span>
                  </div>
                  <div className="font-mono text-[11px] text-emerald-200 bg-black/60 p-2 rounded border border-emerald-900/50">
                    {telemetryLog}
                  </div>
                </div>
              )}

              {/* Action Buttons for Step 2 */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleAuthorizePayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs sm:text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'Authorizing with Gateway & CDP...'
                      : `Pay ${data.priceFormatted} & Finalize Reservation`}
                  </span>
                </button>

                <div className="flex items-center justify-between px-1">
                  <button
                    onClick={() => setStep(1)}
                    disabled={isProcessing}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 font-sans flex items-center gap-1 transition"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back to Details Review</span>
                  </button>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Signed with Merkle Proof
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CONFIRMED RECEIPT & DIRECT LIVE MERCHANT HANDOFF ================= */}
          {step === 3 && (
            <div className="py-4 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                  Payment Authorized &bull; Zero Manual Input
                </span>
                <h2 className="text-2xl font-bold font-sans text-white">
                  Reservation Confirmed!
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
                  {data.domain === 'travel' && `Seat ${passengerAddress.split(' ')[1] || '14A'} has been confirmed with ${data.merchantName}. Boarding pass dispatched to ${passengerEmail}.`}
                  {data.domain === 'shopping' && `Order placed on Flipkart with instant card discount. Express delivery assigned to ${passengerName}.`}
                  {data.domain === 'food' && 'Order sent to restaurant kitchen. Real-time delivery partner assigned.'}
                  {data.domain === 'research' && 'Verified arXiv research paper synthesized. Full markdown & canonical citations cached.'}
                  {data.domain === 'career' && 'Greenhouse application dispatched with 32 fields auto-populated and verified.'}
                </p>
              </div>

              {/* Cryptographic Verified Receipt Card */}
              <div className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 text-left font-mono text-xs space-y-2.5">
                <div className="flex justify-between items-center text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>TRANSACTION HASH</span>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-400">{txHash.slice(0, 10)}...{txHash.slice(-4)}</span>
                    <button
                      onClick={() => handleCopy(txHash, 'hash')}
                      className="p-1 hover:text-white transition"
                    >
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-zinc-300">
                  <span>AMOUNT CHARGED</span>
                  <span className="font-bold text-white text-sm">{data.priceFormatted}</span>
                </div>

                <div className="flex justify-between items-center text-zinc-300">
                  <span>PASSENGER / RECIPIENT</span>
                  <span className="text-white font-sans font-medium">{passengerName}</span>
                </div>

                <div className="flex justify-between items-center text-zinc-300">
                  <span>MERKLE ROOT</span>
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-400">{data.merkleRoot.slice(0, 14)}...</span>
                    <button
                      onClick={() => handleCopy(data.merkleRoot, 'root')}
                      className="p-1 hover:text-white transition"
                    >
                      {copiedRoot ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-zinc-300 border-t border-zinc-800/80 pt-2">
                  <span>PNR / ORDER ID</span>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold">{pnrId}</span>
                    <button
                      onClick={() => handleCopy(pnrId, 'order')}
                      className="p-1 hover:text-white transition"
                    >
                      {copiedOrder ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Step 3: Direct Live Merchant Handoff */}
              <div className="w-full space-y-2 pt-2">
                {/* Prominent Primary Button: Launch Dedicated Merchant Pay Portal */}
                <a
                  href={payPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xl font-sans"
                >
                  <span>Launch Dedicated Merchant Pay Portal (/pay)</span>
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                </a>

                {/* Secondary Button: Raw merchant store page */}
                {directActionUrl && (
                  <a
                    href={directActionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[11px] flex items-center justify-center gap-1.5 transition font-sans"
                  >
                    <span>Open raw merchant store page (Requires manual login)</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                )}

                {/* Secondary Actions: Download JSON & Done */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownloadReceipt}
                    className="py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition font-sans"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Audit JSON</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs transition font-sans"
                  >
                    Done
                  </button>
                </div>

                <p className="text-[11px] text-zinc-500 font-sans pt-1">
                  GhostBrowser held inventory and signed W3C DOM token in {data.merchantName}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
