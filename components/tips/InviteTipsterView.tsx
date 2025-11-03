"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { notificationService } from "@/lib/notifications";
import { authService } from "@/lib/auth";
import { GeneratedTip, tipsService } from "@/lib/tips";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InviteTipsterViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tip: GeneratedTip;
}

type Tipster = {
  id: string;
  name: string;
  avatar?: string;
  tipsOnTable: number;
  avgRating: number; // 0 - 5
};

const MOCK_TIPSTERS: Tipster[] = [
  { id: "t1", name: "Alex Morgan", tipsOnTable: 23, avgRating: 5.0 },
  { id: "t2", name: "Jamie Fox", tipsOnTable: 18, avgRating: 4.9 },
  { id: "t3", name: "Riley Shaw", tipsOnTable: 12, avgRating: 4.8 },
  { id: "t4", name: "Jordan Lee", tipsOnTable: 31, avgRating: 4.7 },
  { id: "t5", name: "Taylor Kim", tipsOnTable: 7, avgRating: 4.9 },
  { id: "t6", name: "Casey Patel", tipsOnTable: 15, avgRating: 4.6 },
];

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const stars = Array.from({ length: 5 }).map((_, i) =>
    i < full ? "★" : "☆"
  );
  return (
    <span className="text-amber-500 text-sm" aria-label={`${rating} out of 5`}>
      {stars.join("")}
    </span>
  );
}

export function InviteTipsterView({ open, onOpenChange, tip }: InviteTipsterViewProps) {
  const [query, setQuery] = useState("");
  const [throttledQuery, setThrottledQuery] = useState("");
  const throttleRef = useRef<number | null>(null);

  // simple throttle: update at most once every 300ms
  useEffect(() => {
    if (throttleRef.current) window.clearTimeout(throttleRef.current);
    throttleRef.current = window.setTimeout(() => {
      setThrottledQuery(query.trim());
    }, 300);
    return () => {
      if (throttleRef.current) window.clearTimeout(throttleRef.current);
    };
  }, [query]);

  const filtered = useMemo(() => {
    const base = MOCK_TIPSTERS;
    if (!throttledQuery) return base.slice(0, 5);
    const q = throttledQuery.toLowerCase();
    return base.filter(t => t.name.toLowerCase().includes(q)).slice(0, 5);
  }, [throttledQuery]);

  const [confirmFor, setConfirmFor] = useState<Tipster | null>(null);

  const sendInvite = (tipster: Tipster) => {
    const result = authService.deductTokens(9);
    if (!result.success) {
      toast.error("Insufficient tokens", { description: result.error });
      return;
    }

    toast.success("Invite sent", {
      description: `Invited ${tipster.name}. ${result.remainingTokens} tokens left.`,
    });
    onOpenChange(false);

    // Assign tip to the selected tipster and notify
    tipsService.assignTipToTipster(tip.id, {
      id: tipster.id,
      name: tipster.name,
      rating: tipster.avgRating,
    });

    notificationService.addNotification({
      type: "tip_assigned",
      title: "New tip assignment",
      message: `Tip assigned to ${tipster.name} (ID: ${tip.id}). Tipster will review fixtures.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#fefdfb] border-[#dddad0] sm:max-w-lg p-0">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-[#dddad0]">
          <DialogTitle className="text-xl font-bold text-[#3a3947]">Invite Tipster</DialogTitle>
          <DialogDescription className="text-[#6b6a7a]">
            Search and select a tipster to send your generated tip.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <Input
            placeholder="Search tipsters by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="px-6 pb-6 space-y-2">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => setConfirmFor(t)}
              className="w-full flex items-center justify-between gap-3 rounded-lg border border-[#dddad0] bg-white p-3 hover:border-[#f4d03f] hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{t.name.split(" ").map(w => w[0]).slice(0,2).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-[#3a3947]">{t.name}</span>
                  <span className="text-xs text-[#6b6a7a]">{t.tipsOnTable} tips on table</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Stars rating={t.avgRating} />
                <span className="text-xs text-[#6b6a7a]">{t.avgRating.toFixed(1)}</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-[#6b6a7a] italic">No tipsters found.</div>
          )}
        </div>
        <AlertDialog open={!!confirmFor} onOpenChange={(o) => !o && setConfirmFor(null)}>
          <AlertDialogContent className="bg-[#fefdfb] border-[#dddad0]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#3a3947]">Send invite to {confirmFor?.name}?</AlertDialogTitle>
              <AlertDialogDescription className="text-[#6b6a7a]">
                This action will cost <span className="font-semibold text-[#3a3947]">9 tokens</span>. You’ll receive a notification once results are in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white border border-[#dddad0] text-[#3a3947] hover:bg-[#dddad0]" onClick={() => setConfirmFor(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-[#f4d03f] text-[#3a3947] hover:shadow-sm"
                onClick={() => {
                  if (confirmFor) {
                    const t = confirmFor;
                    setConfirmFor(null);
                    sendInvite(t);
                  }
                }}
              >
                Send Invite
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

export default InviteTipsterView;


