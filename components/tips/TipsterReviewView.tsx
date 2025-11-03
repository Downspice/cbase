"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTips } from "@/hooks/use-tips";
import { GeneratedTip, Fixture, tipsService } from "@/lib/tips";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { notificationService } from "@/lib/notifications";

interface TipsterReviewViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTip?: (tipId: string) => void;
}

export default function TipsterReviewView({ open, onOpenChange, onSelectTip }: TipsterReviewViewProps) {
  const { tips, refresh } = useTips();
  const { user } = useAuth();
  const tipsterId = useMemo(() => user?.email.toLowerCase() === "tipster@demo.com" ? "t1" : user?.email || "" , [user?.email]);
  const tipsterName = user?.name || "Tipster";
  const tipsterRating = 5.0;

  const assignedTips = useMemo(() => {
    return tips.filter(t => t.assignedTipsterId === tipsterId);
  }, [tips, tipsterId]);

  // Seed dummy assignment for demo if none exists
  useEffect(() => {
    if (!open) return;
    if (!tipsterId) return;
    try {
      const seeded = localStorage.getItem("tbase_tipster_seeded");
      if (!seeded && assignedTips.length === 0) {
        const demo = tipsService.generateTip({} as any);
        tipsService.assignTipToTipster(demo.id, { id: tipsterId, name: tipsterName, rating: tipsterRating });
        notificationService.addNotification({
          type: "tip_assigned",
          title: "New tip assignment",
          message: `Tip assigned to ${tipsterName} (ID: ${demo.id}). Tipster will review fixtures.`,
        });
        localStorage.setItem("tbase_tipster_seeded", "1");
        refresh();
      }
    } catch {}
  }, [open, tipsterId, tipsterName, tipsterRating, assignedTips.length, refresh]);

  const [selected, setSelected] = useState<GeneratedTip | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});

  const openTip = (tip: GeneratedTip) => {
    if (onSelectTip) {
      onOpenChange(false);
      onSelectTip(tip.id);
      return;
    }
    setSelected(tip);
    const map: Record<string, string> = {};
    tip.fixtures.forEach(f => { map[f.id] = f.prediction ? `Insight: ${f.prediction} seems likely.` : "Looks solid."; });
    setComments(map);
  };

  const submitComments = () => {
    if (!selected) return;
    tipsService.addTipsterReviewWithComments(selected.id, {
      id: tipsterId,
      name: tipsterName,
      rating: tipsterRating,
    }, comments);
    notificationService.addNotification({
      type: "tipster_results",
      title: "Tipster results are in",
      message: `${tipsterName} reviewed your tip (ID: ${selected.id}) and added comments to fixtures.`,
    });
    toast.success("Comments submitted");
    refresh();
    setSelected(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#fefdfb] border-[#dddad0] sm:max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#dddad0]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-[#3a3947]">Tipster Workbench</DialogTitle>
              <DialogDescription className="text-[#6b6a7a]">Assigned tips awaiting your comments</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {assignedTips.length === 0 ? (
            <div className="text-sm text-[#6b6a7a]">No assignments yet.</div>
          ) : (
            assignedTips.map(tip => (
              <button
                key={tip.id}
                onClick={() => openTip(tip)}
                className="w-full text-left p-4 rounded-lg border border-[#dddad0] bg-white hover:border-[#f4d03f] hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[#3a3947] font-medium">Tip {tip.id}</div>
                  <div className="text-xs text-[#6b6a7a]">{tip.fixtures.length} fixtures</div>
                </div>
              </button>
            ))
          )}
        </div>

        {selected && !onSelectTip && (
          <div className="border-t border-[#dddad0]">
            <div className="px-6 py-4">
              <div className="text-lg font-semibold text-[#3a3947] mb-2">Add comments to fixtures</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selected.fixtures.map((fx: Fixture, i: number) => (
                  <div key={fx.id} className="p-3 rounded-lg border border-[#dddad0] bg-white">
                    <div className="text-sm text-[#6b6a7a] mb-2">Fixture #{i + 1}</div>
                    <div className="text-sm font-medium text-[#3a3947] mb-2">
                      {fx.homeTeam.name} vs {fx.awayTeam.name}
                    </div>
                    <Input
                      placeholder="Add your comment..."
                      value={comments[fx.id] || ""}
                      onChange={(e) => setComments(prev => ({ ...prev, [fx.id]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setSelected(null)}
                  className="px-3 py-2 rounded-lg bg-white border border-[#dddad0] text-[#3a3947] text-sm font-semibold hover:bg-[#dddad0]"
                >
                  Cancel
                </button>
                <button
                  onClick={submitComments}
                  className="px-3 py-2 rounded-lg bg-[#f4d03f] text-[#3a3947] text-sm font-semibold hover:shadow-sm"
                >
                  Submit Comments
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


