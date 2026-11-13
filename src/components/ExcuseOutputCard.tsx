import { Check, Copy, Quote, RefreshCw } from 'lucide-react';
import { REACTION_OPTIONS, getChaosMeta } from '../utils/excuses';
import type {
  ChaosLevel,
  ReactionType,
  SituationOption,
  TargetOption,
} from '../utils/excuses';

export interface GeneratedExcuseRecord {
  id: number;
  excuse: string;
  target: TargetOption;
  situation: SituationOption;
  chaosLevel: ChaosLevel;
  source: 'gemini' | 'fallback';
}

interface ExcuseOutputCardProps {
  record: GeneratedExcuseRecord | null;
  isLoading: boolean;
  loadingMessage: string;
  copied: boolean;
  selectedReaction: ReactionType | null;
  reactionCounts: Record<ReactionType, number>;
  onCopy: () => void;
  onRate: (reaction: ReactionType) => void;
  onRegenerate: () => void;
}

export function ExcuseOutputCard({
  record,
  isLoading,
  loadingMessage,
  copied,
  selectedReaction,
  reactionCounts,
  onCopy,
  onRate,
  onRegenerate,
}: ExcuseOutputCardProps) {
  return (
    <section
      aria-label="Generated excuse output"
      aria-live="polite"
      className="rounded-2xl border border-white/10 bg-[#12121A] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
    >
      {isLoading ? (
        <div
          data-testid="excuse-loading"
          className="flex min-h-[150px] flex-col items-center justify-center gap-3 text-center"
        >
          <div className="relative flex h-11 w-11 items-center justify-center">
            <span className="absolute inset-0 rounded-full border-2 border-[#A855F7]/30 border-t-[#A3E635] animate-spin" />
            <span className="font-mono text-xs font-bold text-[#A3E635]">AI</span>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-[#F4F4F8]">
              {loadingMessage}
            </p>
            <p className="text-xs text-[#9C9DB2]">
              Calibrating maximum believability vs. comedic payoff
            </p>
          </div>
        </div>
      ) : !record ? (
        <div
          data-testid="excuse-empty"
          className="flex min-h-[150px] flex-col items-center justify-center gap-2.5 text-center"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A855F7]/15 text-[#C084FC]">
            <Quote aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="max-w-md space-y-1">
            <h2 className="text-lg font-bold text-[#F4F4F8]">
              Your alibi will appear here
            </h2>
            <p className="text-sm leading-relaxed text-[#9C9DB2]">
              Pick your target, select the disaster, dial in the chaos level, and hit{' '}
              <span className="font-semibold text-[#A3E635]">Generate Excuse</span>.
            </p>
          </div>
        </div>
      ) : (
        <div data-testid="excuse-result" className="space-y-4">
          {/* Metadata strip — unboxed typography with clean separators */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 pb-3 text-xs text-[#9C9DB2]">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-[#C084FC]">{record.target}</span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden="true">·</span>
                <span>{record.situation}</span>
              </span>
              <span className="inline-flex items-center gap-2 font-mono font-bold tabular-nums text-[#A3E635]">
                <span aria-hidden="true" className="font-sans font-normal text-[#9C9DB2]">·</span>
                <span>Chaos {record.chaosLevel}/5 ({getChaosMeta(record.chaosLevel).shortLabel})</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#D4D4E0] transition-colors hover:bg-white/8 hover:text-[#A3E635] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] whitespace-nowrap shrink-0"
            >
              <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Try Another</span>
            </button>
          </div>

          {/* Stylish editorial quote block */}
          <blockquote
            data-testid="excuse-quote"
            className="py-2"
          >
            <Quote
              aria-hidden="true"
              className="mb-2 h-5 w-5 text-[#A3E635]"
            />
            <p className="text-lg font-medium leading-relaxed text-[#F4F4F8] sm:text-xl">
              {record.excuse}
            </p>
          </blockquote>

          {/* Actions row: Copy to Clipboard + Rate This Excuse */}
          <div className="flex flex-col gap-4 border-t border-white/8 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onCopy}
              className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] whitespace-nowrap shrink-0 ${
                copied
                  ? 'bg-[#A3E635] text-[#09090D]'
                  : 'border border-white/15 bg-[#1B1B28] text-[#F4F4F8] hover:border-[#A3E635]/60 hover:text-[#A3E635]'
              }`}
            >
              {copied ? (
                <>
                  <Check aria-hidden="true" className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy aria-hidden="true" className="h-4 w-4" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>

            <div className="flex flex-col gap-2 sm:items-end">
              <span className="text-xs font-medium text-[#9C9DB2]">
                Rate This Excuse
              </span>
              <div
                role="group"
                aria-label="Rate this excuse"
                className="flex flex-wrap items-center gap-2"
              >
                {REACTION_OPTIONS.map((option) => {
                  const isSelected = selectedReaction === option.id;
                  const count = reactionCounts[option.id];
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onRate(option.id)}
                      aria-pressed={isSelected}
                      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-150 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'border border-[#A855F7] bg-[#A855F7]/25 text-[#F4F4F8] shadow-[0_0_16px_rgba(168,85,247,0.3)]'
                          : 'border border-white/12 bg-[#191924] text-[#D4D4E0] hover:border-[#A855F7]/50 hover:text-[#F4F4F8]'
                      }`}
                    >
                      <span aria-hidden="true">{option.emoji}</span>
                      <span>{option.label}</span>
                      {count > 0 && (
                        <span className="ml-0.5 font-mono text-[11px] tabular-nums text-[#A3E635]">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
