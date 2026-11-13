import { ChevronDown, Sparkles, Zap } from 'lucide-react';
import {
  CHAOS_LEVELS,
  SITUATIONS,
  TARGETS,
  getChaosMeta,
} from '../utils/excuses';
import type {
  ChaosLevel,
  SituationOption,
  TargetOption,
} from '../utils/excuses';

interface ExcuseControlsProps {
  target: TargetOption;
  situation: SituationOption;
  chaosLevel: ChaosLevel;
  isLoading: boolean;
  loadingMessage: string;
  onTargetChange: (target: TargetOption) => void;
  onSituationChange: (situation: SituationOption) => void;
  onChaosChange: (level: ChaosLevel) => void;
  onGenerate: () => void;
}

export function ExcuseControls({
  target,
  situation,
  chaosLevel,
  isLoading,
  loadingMessage,
  onTargetChange,
  onSituationChange,
  onChaosChange,
  onGenerate,
}: ExcuseControlsProps) {
  const chaosMeta = getChaosMeta(chaosLevel);
  const progressPercent = ((chaosLevel - 1) / 4) * 100;

  return (
    <section
      aria-label="Excuse configuration"
      className="rounded-2xl border border-white/10 bg-[#12121A] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Target / Who is it for? */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="target-select"
            className="text-sm font-semibold text-[#D4D4E0]"
          >
            Target / Who is it for?
          </label>
          <div className="relative">
            <select
              id="target-select"
              value={target}
              onChange={(e) => onTargetChange(e.target.value as TargetOption)}
              className="w-full appearance-none rounded-xl border border-white/15 bg-[#191924] px-4 py-2.5 pr-10 text-sm font-medium text-[#F4F4F8] transition-colors hover:border-[#A855F7]/60 focus:border-[#A3E635] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635]/40"
            >
              {TARGETS.map((option) => (
                <option key={option} value={option} className="bg-[#12121A] text-[#F4F4F8]">
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A855F7]"
            />
          </div>
        </div>

        {/* Situation / What did you miss? */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="situation-select"
            className="text-sm font-semibold text-[#D4D4E0]"
          >
            Situation / What did you miss?
          </label>
          <div className="relative">
            <select
              id="situation-select"
              value={situation}
              onChange={(e) => onSituationChange(e.target.value as SituationOption)}
              className="w-full appearance-none rounded-xl border border-white/15 bg-[#191924] px-4 py-2.5 pr-10 text-sm font-medium text-[#F4F4F8] transition-colors hover:border-[#A855F7]/60 focus:border-[#A3E635] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635]/40"
            >
              {SITUATIONS.map((option) => (
                <option key={option} value={option} className="bg-[#12121A] text-[#F4F4F8]">
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A855F7]"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-white/8" />

      {/* Chaos Level Slider */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label
            htmlFor="chaos-slider"
            className="text-sm font-semibold text-[#D4D4E0]"
          >
            Chaos Level
          </label>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-mono font-bold tabular-nums text-[#A3E635]">
              {chaosLevel}/5
            </span>
            <span aria-hidden="true" className="text-white/30">
              ·
            </span>
            <span className="font-medium text-[#C084FC]">{chaosMeta.label}</span>
          </div>
        </div>

        <input
          id="chaos-slider"
          type="range"
          min={1}
          max={5}
          step={1}
          value={chaosLevel}
          onChange={(e) => onChaosChange(Number(e.target.value) as ChaosLevel)}
          aria-valuetext={`${chaosLevel} out of 5: ${chaosMeta.label}`}
          style={{
            background: `linear-gradient(90deg, #A3E635 0%, #A855F7 ${progressPercent}%, #232333 ${progressPercent}%, #232333 100%)`,
          }}
          className="chaos-slider h-2.5 w-full rounded-full focus:outline-none"
        />

        {/* Quick-tap level markers 1-5 */}
        <div className="grid grid-cols-5 gap-1.5 pt-0.5">
          {CHAOS_LEVELS.map((item) => {
            const active = item.level === chaosLevel;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => onChaosChange(item.level)}
                aria-label={`Set chaos level ${item.level}: ${item.label}`}
                aria-pressed={active}
                className={`flex flex-col items-center justify-center rounded-lg px-2 py-1.5 text-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] ${
                  active
                    ? 'bg-[#A855F7]/20 text-[#F4F4F8] ring-1 ring-[#A855F7]/60'
                    : 'bg-transparent text-[#8F90A6] hover:bg-white/5 hover:text-[#D4D4E0]'
                }`}
              >
                <span
                  className={`font-mono text-xs font-bold tabular-nums ${
                    active ? 'text-[#A3E635]' : ''
                  }`}
                >
                  {item.level}
                </span>
                <span className="mt-0.5 hidden text-[11px] font-medium sm:block whitespace-nowrap">
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs leading-relaxed text-[#9C9DB2]">
          {chaosMeta.description}
        </p>
      </div>

      {/* Generate CTA */}
      <div className="mt-5">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#A3E635] px-6 py-3.5 text-base font-bold text-[#09090D] shadow-[0_0_28px_rgba(163,230,53,0.35)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#BEF264] hover:shadow-[0_0_38px_rgba(163,230,53,0.55)] active:translate-y-0 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12121A] disabled:cursor-wait disabled:opacity-90 whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <Sparkles
                aria-hidden="true"
                className="h-5 w-5 animate-spin text-[#09090D]"
              />
              <span className="truncate">{loadingMessage}</span>
            </>
          ) : (
            <>
              <Zap
                aria-hidden="true"
                className="h-5 w-5 fill-[#09090D] transition-transform duration-150 group-hover:scale-110 group-hover:-rotate-6"
              />
              <span>Generate Excuse</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
