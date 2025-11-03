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
import { Fixture, GeneratedTip, tipsService } from "@/lib/tips";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { notificationService } from "@/lib/notifications";

interface TipsterFixturesViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipId: string | null;
}

export default function TipsterFixturesView({ open, onOpenChange, tipId }: TipsterFixturesViewProps) {
  const { tips, refresh } = useTips();
  const { user } = useAuth();

  const tip: GeneratedTip | null = useMemo(() => {
    if (!tipId) return null;
    return tips.find(t => t.id === tipId) || null;
  }, [tips, tipId]);

  const [comments, setComments] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tip) {
      const map: Record<string, string> = {};
      tip.fixtures.forEach(f => { map[f.id] = ""; });
      setComments(map);
    }
  }, [tip?.id]);

  const submit = () => {
    if (!tip || !user) return;
    const tipsterId = user.email.toLowerCase() === "tipster@demo.com" ? "t1" : user.email;
    tipsService.addTipsterReviewWithComments(tip.id, {
      id: tipsterId,
      name: user.name || "Tipster",
      rating: 5.0,
    }, comments);
    notificationService.addNotification({
      type: "tipster_results",
      title: "Tipster results are in",
      message: `${user.name || "Tipster"} reviewed your tip (ID: ${tip.id}) and added comments to fixtures.`,
    });
    toast.success("Comments submitted");
    refresh();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#fefdfb] border-[#dddad0] sm:max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#dddad0]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-[#3a3947]">Assigned Tip</DialogTitle>
              <DialogDescription className="text-[#6b6a7a]">Review fixtures and add your comments</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!tip ? (
          <div className="px-6 py-8 text-sm text-[#6b6a7a]">No tip selected.</div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tip.fixtures.map((fx: Fixture, i: number) => (
                <div key={fx.id} className="p-4 rounded-xl border border-[#dddad0] bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-[#6b6a7a]">Fixture #{i + 1}</div>
                    {fx.prediction && (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">{fx.prediction}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-4xl leading-none">{fx.homeTeam.logo || "🏆"}</div>
                      <div className="text-sm font-semibold text-[#3a3947] text-center max-w-[140px] truncate">{fx.homeTeam.name}</div>
                    </div>
                    <div className="text-center text-xs text-[#6b6a7a]">vs</div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-4xl leading-none">{fx.awayTeam.logo || "🏆"}</div>
                      <div className="text-sm font-semibold text-[#3a3947] text-center max-w-[140px] truncate">{fx.awayTeam.name}</div>
                    </div>
                  </div>
                  <Input
                    placeholder="Add your comment..."
                    value={comments[fx.id] || ""}
                    onChange={(e) => setComments(prev => ({ ...prev, [fx.id]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenChange(false)}
                className="px-3 py-2 rounded-lg bg-white border border-[#dddad0] text-[#3a3947] text-sm font-semibold hover:bg-[#dddad0]"
              >
                Close
              </button>
              <button
                onClick={submit}
                className="px-3 py-2 rounded-lg bg-[#f4d03f] text-[#3a3947] text-sm font-semibold hover:shadow-sm"
              >
                Submit Comments
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


