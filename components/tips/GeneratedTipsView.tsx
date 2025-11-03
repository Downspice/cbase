"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTips } from "@/hooks/use-tips";
import { motion } from "framer-motion";
import { GeneratedTip } from "@/lib/tips";

interface GeneratedTipsViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTipClick: (tip: GeneratedTip) => void;
}

export function GeneratedTipsView({ open, onOpenChange, onTipClick }: GeneratedTipsViewProps) {
  const { tips } = useTips();

  const formatTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#fefdfb] border-[#dddad0] sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#3a3947]">
            Generated Tips
          </DialogTitle>
          <DialogDescription className="text-[#6b6a7a]">
            View and manage your generated tips
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 mt-4">
          {tips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <div className="text-lg font-semibold text-[#3a3947] mb-2">No tips generated yet</div>
              <div className="text-sm text-[#6b6a7a]">Generate your first tips to see them here!</div>
            </div>
          ) : (
            tips.map((tip) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onTipClick(tip);
                  onOpenChange(false);
                }}
                className="p-4 rounded-lg border border-[#dddad0] bg-white cursor-pointer transition-all hover:border-[#f4d03f] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">⚽</span>
                      <h4 className="font-semibold text-[#3a3947]">
                        Tips Generated
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        tip.status === "completed" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {tip.status}
                      </span>
                      {/* Tipster responded badge */}
                      {tip.fixtures.some(fx => (fx.comments && fx.comments.length > 0)) && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                          Tipster responded
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#6b6a7a] mb-2">
                      {tip.fixtures.length} fixture{tip.fixtures.length !== 1 ? "s" : ""} generated
                    </div>
                    <div className="text-xs text-[#6b6a7a]">
                      {formatTime(tip.timestamp)}
                    </div>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

