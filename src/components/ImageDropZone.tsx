"use client";

import { useRef } from "react";

interface ImageDropZoneProps {
  onFile: (file: File) => void;
}

export default function ImageDropZone({ onFile }: ImageDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg mx-auto"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-md w-full border border-dashed border-white/20 rounded-2xl p-16 hover:border-white/30 transition-colors cursor-pointer group"
      >
        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-5 group-hover:bg-white/15 transition-colors">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-white/50"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <div className="flex flex-col items-center justify-center gap-0">
          <p className="text-white/70 font-medium text-sm">
            Drop an image here
          </p>
          <p className="text-white/40 text-xs">
            or paste from clipboard (Ctrl+V / Cmd+V)
          </p>
        </div>

        <label
          className="flex items-center mt-5 gap-2 px-3 justify-center py-1.5 rounded-xl text-sm text-white/80 bg-white/10 border border-white/10 hover:bg-white/15 transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <svg className="size-4 opacity-50" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="M5,14.75h-.75c-1.105,0-2-.895-2-2V4.75c0-1.105,.895-2,2-2h1.825c.587,0,1.144,.258,1.524,.705l1.524,1.795h4.626c1.105,0,2,.895,2,2v1"></path><path d="M16.148,13.27l.843-3.13c.257-.953-.461-1.89-1.448-1.89H6.15c-.678,0-1.272,.455-1.448,1.11l-.942,3.5c-.257,.953,.461,1.89,1.448,1.89H14.217c.904,0,1.696-.607,1.931-1.48Z"></path></g></svg>
          Browse files
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>

      </div>
    </div>
  );
}
