import { useEffect, useRef, useState } from 'react';
import { CopyToast } from './components/CopyToast';
import { ExcuseControls } from './components/ExcuseControls';
import { ExcuseOutputCard } from './components/ExcuseOutputCard';
import type { GeneratedExcuseRecord } from './components/ExcuseOutputCard';
import {
  SITUATIONS,
  TARGETS,
  formatExcuseForCopy,
  generateFallbackExcuse,
  pickNextLoadingMessage,
} from './utils/excuses';
import type {
  ChaosLevel,
  ReactionType,
  SituationOption,
  TargetOption,
} from './utils/excuses';

const INITIAL_COUNTS: Record<ReactionType, number> = {
  genius: 0,
  hilarious: 0,
  suspicious: 0,
};

export default function App() {
  const [target, setTarget] = useState<TargetOption>(TARGETS[0]);
  const [situation, setSituation] = useState<SituationOption>(SITUATIONS[0]);
  const [chaosLevel, setChaosLevel] = useState<ChaosLevel>(3);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(() => pickNextLoadingMessage());
  const [record, setRecord] = useState<GeneratedExcuseRecord | null>(null);

  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<ReactionType, number>>(INITIAL_COUNTS);

  const copyTimeoutRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const loadingIntervalRef = useRef<number | null>(null);
  const excuseIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
      if (loadingIntervalRef.current) window.clearInterval(loadingIntervalRef.current);
    };
  }, []);

  async function handleGenerate() {
    if (isLoading) return;

    setIsLoading(true);
    setCopied(false);
    setSelectedReaction(null);
    setLoadingState((prev) => pickNextLoadingMessage(prev.index));

    if (loadingIntervalRef.current) {
      window.clearInterval(loadingIntervalRef.current);
    }
    loadingIntervalRef.current = window.setInterval(() => {
      setLoadingState((prev) => pickNextLoadingMessage(prev.index));
    }, 900);

    const minDelay = new Promise((resolve) => window.setTimeout(resolve, 750));

    let nextExcuse = '';
    let source: 'gemini' | 'fallback' = 'fallback';

    try {
      const [response] = await Promise.all([
        fetch('/api/generate-excuse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target, situation, chaosLevel }),
        }),
        minDelay,
      ]);

      if (response.ok) {
        const data = (await response.json()) as {
          excuse?: string;
          source?: 'gemini' | 'fallback';
        };
        if (data.excuse && data.excuse.trim().length > 0) {
          nextExcuse = data.excuse.trim();
          source = data.source === 'gemini' ? 'gemini' : 'fallback';
        }
      }
    } catch {
      await minDelay;
    } finally {
      if (loadingIntervalRef.current) {
        window.clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
    }

    if (!nextExcuse) {
      nextExcuse = generateFallbackExcuse(target, situation, chaosLevel);
      source = 'fallback';
    }

    excuseIdRef.current += 1;
    setRecord({
      id: excuseIdRef.current,
      excuse: nextExcuse,
      target,
      situation,
      chaosLevel,
      source,
    });
    setIsLoading(false);
  }

  async function handleCopy() {
    if (!record) return;
    const textToCopy = formatExcuseForCopy(record.excuse);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
    }

    setCopied(true);
    setToastVisible(true);

    if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);

    copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2800);
    toastTimeoutRef.current = window.setTimeout(() => setToastVisible(false), 4000);
  }

  function handleRate(reaction: ReactionType) {
    if (!record) return;

    setReactionCounts((prev) => {
      const next = { ...prev };
      if (selectedReaction === reaction) {
        next[reaction] = Math.max(0, next[reaction] - 1);
        return next;
      }
      if (selectedReaction) {
        next[selectedReaction] = Math.max(0, next[selectedReaction] - 1);
      }
      next[reaction] += 1;
      return next;
    });

    setSelectedReaction((prev) => (prev === reaction ? null : reaction));
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#09090D] text-[#F4F4F8]">
      {/* Subtle atmospheric dark-mode accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[#A855F7]/12 blur-[120px]" />
        <div className="absolute -bottom-48 right-1/4 h-[340px] w-[520px] rounded-full bg-[#A3E635]/8 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <header className="mb-5 text-center sm:mb-6">
          <h1
            className="font-extrabold tracking-tight text-[#F4F4F8]"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              textWrap: 'balance',
            }}
          >
            Excuse Generator 3000 🚀
          </h1>
          <p className="mt-2 text-base italic text-[#B8B9CC] sm:text-lg">
            Because telling the truth is too mainstream.
          </p>
        </header>

        {/* Centered interactive stack */}
        <div className="flex flex-col gap-4">
          <ExcuseControls
            target={target}
            situation={situation}
            chaosLevel={chaosLevel}
            isLoading={isLoading}
            loadingMessage={loadingState.message}
            onTargetChange={setTarget}
            onSituationChange={setSituation}
            onChaosChange={setChaosLevel}
            onGenerate={handleGenerate}
          />

          <ExcuseOutputCard
            record={record}
            isLoading={isLoading}
            loadingMessage={loadingState.message}
            copied={copied}
            selectedReaction={selectedReaction}
            reactionCounts={reactionCounts}
            onCopy={handleCopy}
            onRate={handleRate}
            onRegenerate={handleGenerate}
          />
        </div>
      </main>

      <CopyToast
        visible={toastVisible}
        message="Copied to clipboard! Good luck surviving 🛡️"
      />
    </div>
  );
}
