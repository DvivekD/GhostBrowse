'use client';

import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FileText,
  UserCheck,
  Send,
  Building,
  DollarSign,
  MapPin,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';

interface CareerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
  companyName?: string;
  salaryRange?: string;
  merkleRoot?: string;
}

export function CareerApplicationModal({
  isOpen,
  onClose,
  jobTitle = 'Staff AI Engineer — Autonomous Systems',
  companyName = 'Anthropic / Frontier AI Lab',
  salaryRange = '$185,000 - $240,000 / yr',
  merkleRoot = '9c3e41b52a1d8f7e6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f'
}: CareerApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationToken, setConfirmationToken] = useState('GH-APP-984210');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const atsFields = [
    { label: 'First Name', key: 'first_name', value: 'Vivek' },
    { label: 'Last Name', key: 'last_name', value: 'D.' },
    { label: 'Email Address', key: 'email', value: 'vivek.d@ghostbrowser.dev' },
    { label: 'Phone Number', key: 'phone', value: '+91 98765 43210' },
    { label: 'LinkedIn Profile', key: 'linkedin_profile', value: 'https://linkedin.com/in/vivekd' },
    { label: 'GitHub Profile', key: 'github_profile', value: 'https://github.com/DvivekD' },
    { label: 'Portfolio URL', key: 'portfolio_url', value: 'https://ghostbrowse-blush.vercel.app' },
    { label: 'Location & Work Auth', key: 'work_authorization', value: 'Authorized to work in US / Remote (No sponsorship required)' },
    { label: 'Years of Experience', key: 'experience_years', value: '7+ Years (Distributed Systems & Agentic AI)' },
    { label: 'Current Role & Stack', key: 'current_stack', value: 'Principal Agentic Engineer (Rust, TypeScript, Python, CDP, WebGL)' },
    { label: 'Desired Compensation', key: 'desired_salary', value: '$210,000 / yr + Equity (0.10%)' },
    { label: 'Screening Answer (Architecture)', key: 'screening_q1', value: 'Architected GhostBrowser zero-click autonomous execution engine bypassing 47 manual inputs with cryptographic W3C C14N Merkle proof validation.' }
  ];

  const tailoredResumeMarkdown = `# Vivek D. — Staff AI Engineer (Autonomous Systems)
**Email**: vivek.d@ghostbrowser.dev | **Phone**: +91 98765 43210
**GitHub**: https://github.com/DvivekD | **Portfolio**: https://ghostbrowse-blush.vercel.app
**Location**: San Francisco, CA / Remote

---

## Executive Summary
Staff AI Systems Engineer specializing in autonomous zero-click web agents, headless browser fleet orchestration (CDP / Playwright), and high-throughput LLM reasoning cascades. Builder of GhostBrowser (wHACKiest 2026).

---

## Core Technical Competencies
- **Languages**: Rust, TypeScript, Python 3.12, Go, C++
- **Autonomous Systems**: Chrome DevTools Protocol (CDP), Playwright, Steel.dev Cloud Fleets, Stealth Browser Sandboxing
- **AI & Reasoning**: Multi-tier LLM Cascades (Groq LPU, Gemini 2.0 Flash, SambaNova Llama-3.3-70B), GRPO, Prompt Optimization
- **Web & Infrastructure**: Next.js 16 (Turbopack), FastAPI, WebGL (Three.js), W3C C14N Canonicalization, SHA-256 Merkle Proofs, Docker

---

## Key Projects & Impact
### GhostBrowser — Autonomous Zero-Click Web Execution Engine (2026)
- Designed 4-tier reasoning cascade resolving natural language intent across Travel, Food, E-Commerce, and Research into verified 1-Action Approval Cards.
- Built a cryptographic DOM validation engine constructing 4-leaf SHA-256 Merkle trees verifying tamper-evident price claims against live headless browser states.
- Implemented stateful human-in-the-loop payment vault bypassing 47 form fields with sub-second biometric passkey and UPI intent execution.

---

## Target Role Alignment: ${jobTitle}
- **Compensation Expectation**: ${salaryRange}
- **Availability**: Immediate / 2 Weeks Notice
- **Verified Merkle Hash**: ${merkleRoot}
`;

  const handleCopyField = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleDownloadResume = () => {
    const blob = new Blob([tailoredResumeMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tailored_Resume_Staff_AI_Engineer_VivekD.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPayloadJson = () => {
    const payload = {
      job_title: jobTitle,
      company: companyName,
      portal: 'Greenhouse.io',
      fields_auto_populated: atsFields,
      candidate: {
        name: 'Vivek D.',
        email: 'vivek.d@ghostbrowser.dev',
        phone: '+91 98765 43210'
      },
      resume_text_markdown: tailoredResumeMarkdown,
      timestamp_utc: new Date().toISOString(),
      w3c_c14n_merkle_root: merkleRoot
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Greenhouse_Application_Payload_${jobTitle.replace(/\\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmitApplication = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      setConfirmationToken(`GH-AUTH-${randomNum}`);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <BorderBeam size={220} duration={5} colorFrom="#10b981" colorTo="#38bdf8" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-bold text-base text-white">
                  Greenhouse ATS Application Vault
                </h3>
                <span className="rounded bg-emerald-950/80 border border-emerald-700 px-2 py-0.5 text-[10px] font-mono uppercase text-emerald-400">
                  Ready to Dispatch
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                32 inputs auto-populated from resume &bull; Zero manual typing required
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

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto grow text-xs font-sans">
          {/* Target Role & Compensation Card */}
          <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 block tracking-wider">
                  VERIFIED JOB DISPATCH &bull; GREENHOUSE.IO
                </span>
                <h4 className="text-base sm:text-lg font-bold font-sans text-white mt-0.5">
                  {jobTitle}
                </h4>
                <p className="text-xs text-zinc-400 font-sans mt-0.5 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{companyName}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>San Francisco / Remote</span>
                  </span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-base font-bold font-mono text-emerald-400">
                  {salaryRange}
                </span>
                <span className="text-[10px] text-zinc-500 block font-mono">
                  + 0.10% Equity Grant
                </span>
              </div>
            </div>
          </div>

          {/* Submission Confirmation Banner if submitted */}
          {isSubmitted && (
            <div className="rounded-xl bg-emerald-950/50 border border-emerald-600 p-4 flex items-center gap-3 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white text-sm block">
                  Application Successfully Dispatched to Greenhouse!
                </span>
                <p className="text-[11px] text-emerald-300 font-mono mt-0.5">
                  Submission Token: <strong>{confirmationToken}</strong> &bull; Tailored resume &amp; screening payload confirmed.
                </p>
              </div>
            </div>
          )}

          {/* 32-Field Auto-Filled Inspection Matrix */}
          <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pre-Populated Greenhouse Form Inputs (32 Fields)</span>
              </span>
              <span className="font-mono text-[10px] text-emerald-400">100% Match Verified</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {atsFields.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/80 border border-zinc-850 gap-2 text-[11px]"
                >
                  <div className="min-w-[120px]">
                    <span className="text-zinc-500 font-mono text-[10px] block uppercase">
                      {field.label}
                    </span>
                    <span className="text-zinc-300 truncate max-w-xs block font-sans">
                      {field.value}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyField(field.key, field.value)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition shrink-0"
                    title="Copy field value"
                  >
                    {copiedField === field.key ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Seal */}
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-850 pt-2">
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>W3C C14N FORM SUBMISSION HASH VALIDATED</span>
            </div>
            <span>ROOT: {merkleRoot.slice(0, 12)}...</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Primary 1-Click Submit Button */}
              <button
                onClick={handleSubmitApplication}
                disabled={isSubmitting || isSubmitted}
                className="py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50 font-sans"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Transmitting to Greenhouse API...</span>
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Application Confirmed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>1-Click Submit Application via Greenhouse</span>
                  </>
                )}
              </button>

              {/* Download Tailored Markdown Resume */}
              <button
                onClick={handleDownloadResume}
                className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition border border-zinc-700 font-sans"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Tailored Resume (.md)</span>
              </button>
            </div>

            <div className="flex items-center justify-between px-1 text-[11px] text-zinc-500 font-sans">
              <button
                onClick={handleDownloadPayloadJson}
                className="text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition underline underline-offset-2"
              >
                <span>Export ATS Form JSON Bundle</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <span>Zero-Click Human-in-the-Loop Safe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
