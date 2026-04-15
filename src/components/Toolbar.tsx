"use client";

import cn from 'mxcn';


interface ToolbarProps {
  picking: boolean;
  hasPins: boolean;
  copyFeedback: boolean;
  onTogglePicking: () => void;
  onCopyImage: () => void;
  onClearPins: () => void;
  onNewImage: () => void;
  disabled?: boolean;
}

export default function Toolbar({
  picking,
  hasPins,
  copyFeedback,
  onTogglePicking,
  onCopyImage,
  onClearPins,
  onNewImage,
  disabled,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-3 w-full p-4 pb-2">

      <div className={cn("flex items-center", disabled && "opacity-40 pointer-events-none")}>
        <button
          onClick={onTogglePicking}
          disabled={disabled}
          className={cn(`flex items-center gap-2 px-3 py-1.5 rounded-l-xl text-[13px] font-medium border border-white/10 text-white transition-colors`,
            picking && "bg-white/20 hover:bg-white/30",
            !picking && "bg-white/10 hover:bg-white/15"
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="M9.235,5.735L3.128,11.842c-.837,.837-.837,2.194,0,3.03,.837,.837,2.194,.837,3.03,0l6.107-6.107"></path><line x1="3.128" y1="14.872" x2="1.75" y2="16.25"></line><path d="M12.265,8.765l2.857-2.857c.837-.837,.837-2.194,0-3.03-.837-.837-2.194-.837-3.03,0l-2.857,2.857"></path><line x1="7.75" y1="4.25" x2="13.75" y2="10.25"></line></g></svg>
          <span className="flex-1 text-left">
            {picking ? "Picking colors..." : "Pick colors"}
          </span>
          <span className="font-mono text-xs w-2 h-2 px-2.5 py-2.5 inline-flex items-center justify-center rounded-md bg-black/30">
            P
          </span>
        </button>

        <button
          onClick={onClearPins}
          disabled={disabled}
          className="flex items-center gap-2 px-3 w-[150px] justify-center py-1.5 rounded-r-xl text-[13px] font-medium bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="M9.235,5.735L3.128,11.842c-.837,.837-.837,2.194,0,3.03,.837,.837,2.194,.837,3.03,0l6.107-6.107"></path><line x1="3.128" y1="14.872" x2="1.75" y2="16.25"></line><path d="M12.265,8.765l2.857-2.857c.837-.837,.837-2.194,0-3.03-.837-.837-2.194-.837-3.03,0l-2.857,2.857"></path><line x1="7.75" y1="4.25" x2="13.75" y2="10.25"></line></g></svg>
          Clear pins
          <span className="font-mono text-xs w-2 h-2 px-2.5 py-2.5 inline-flex items-center justify-center rounded-md bg-black/30">
            X
          </span>
        </button>

      </div>


      <div className="flex-1" />

      <div className={cn("flex items-center", disabled && "opacity-40 pointer-events-none")}>
        <button
          onClick={onNewImage}
          disabled={disabled}
          className="flex items-center gap-2 px-3 w-[150px] justify-center py-1.5 rounded-l-xl text-[13px] font-medium bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 opacity-50" width="18" height="18" viewBox="0 0 18 18"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="M3.76196 14.989L9.83597 8.914C10.617 8.133 11.883 8.133 12.664 8.914L15.25 11.5"></path> <path d="M6.25 8.5C6.94 8.5 7.5 7.9404 7.5 7.25C7.5 6.5596 6.94 6 6.25 6C5.56 6 5 6.5596 5 7.25C5 7.9404 5.56 8.5 6.25 8.5Z" fill="currentColor" data-stroke="none" stroke="none"></path> <path d="M14.25 1.25V6.25"></path> <path d="M8.92239 2.75H4.75C3.645 2.75 2.75 3.6455 2.75 4.75V13.25C2.75 14.3545 3.645 15.25 4.75 15.25H13.25C14.355 15.25 15.25 14.3545 15.25 13.25V11.5"></path> <path d="M16.75 3.75H11.75"></path></g></svg>
          New image
          <span className="font-mono text-xs w-2 h-2 px-2.5 py-2.5 inline-flex items-center justify-center rounded-md bg-black/30">
            N
          </span>
        </button>

        <button
          onClick={onCopyImage}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 w-[150px] rounded-r-xl text-[13px] font-medium bg-[#FF6161]/10 border border-[#FF6161]/20 border-l-0 text-[#FF6161] hover:bg-[#FF6161]/20 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            // className="opacity-50"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <span className="flex-1 text-left">
            {copyFeedback ? "Copied!" : "Copy image"}
          </span>
          <span className="font-mono text-xs w-2 h-2 px-2.5 py-2.5 inline-flex items-center justify-center rounded-md bg-black/30">
            C
          </span>
        </button>
      </div>

    </div>
  );
}
