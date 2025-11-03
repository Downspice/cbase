"use client";

import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

interface TokenDisplayProps {
  onClick?: () => void;
}

export function TokenDisplay({ onClick }: TokenDisplayProps) {
  const { user } = useAuth();
  const tokens = user?.tokens ?? 0;
  const isLow = tokens < 15;

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`rounded-xl border-2 border-[#4a4856] bg-transparent px-4 py-2 font-semibold transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb] ${
        isLow ? "text-red-500 border-red-500" : "text-[#3a3947]"
      }`}
    >
      <span className="flex items-center gap-2">
        <span>🪙</span>
        <span>{tokens} Tokens</span>
      </span>
    </motion.button>
  );
}

