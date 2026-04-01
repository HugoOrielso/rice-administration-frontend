"use client";

import { ShoppingCart } from "lucide-react";

interface FloatingCartButtonProps {
  count: number;
  onClick: () => void;
}

export function FloatingCartButton({
  count,
  onClick,
}: FloatingCartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="right-6 bottom-6 z-40 relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700 text-white shadow-xl transition hover:scale-105 hover:bg-emerald-800"
    >
      <ShoppingCart className="h-7 w-7" />

      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-extrabold text-white">
          {count}
        </span>
      )}
    </button>
  );
}