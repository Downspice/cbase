"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/lib/auth";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface TokensViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTopUp: () => void;
}

export function TokensView({ open, onOpenChange, onTopUp }: TokensViewProps) {
  const { user } = useAuth();
  const tokens = user?.tokens ?? 0;
  const isLow = tokens < 15;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#fefdfb] border-[#dddad0] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#3a3947]">
            Your Tokens
          </DialogTitle>
          <DialogDescription className="text-[#6b6a7a]">
            Manage your token balance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-gradient-to-br from-[#f4d03f]/10 to-[#ffa726]/10">
            <div className="text-6xl mb-4">🪙</div>
            <div
              className={`text-4xl font-bold mb-2 ${
                isLow ? "text-red-500" : "text-[#3a3947]"
              }`}
            >
              {tokens}
            </div>
            <div className="text-lg text-[#6b6a7a]">Tokens Remaining</div>
            {isLow && (
              <div className="mt-4 px-4 py-2 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                ⚠️ Low balance! You need at least 15 tokens to generate tips comfortably.
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm text-[#6b6a7a]">
            <div className="flex justify-between">
              <span>Tokens per generation:</span>
              <span className="font-semibold text-[#3a3947]">5 tokens</span>
            </div>
            <div className="flex justify-between">
              <span>Generations possible:</span>
              <span className="font-semibold text-[#3a3947]">
                {Math.floor(tokens / 5)} generations
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onOpenChange(false);
              onTopUp();
            }}
            className="w-full rounded-xl bg-[#f4d03f] px-6 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)]"
          >
            Top Up Tokens
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

