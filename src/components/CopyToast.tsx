interface CopyToastProps {
  visible: boolean;
  message: string;
}

export function CopyToast({ visible, message }: CopyToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      className={`pointer-events-none fixed bottom-6 left-1/2 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-[#A3E635] bg-[#181826] px-5 py-3 text-center text-sm font-semibold text-[#F4F4F8] shadow-[0_14px_40px_rgba(0,0,0,0.75),0_0_28px_rgba(163,230,53,0.3)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'translate-y-3 scale-95 opacity-0'
      }`}
    >
      {message}
    </div>
  );
}
