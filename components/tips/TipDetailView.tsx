"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { GeneratedTip, TipFilters, Fixture, tipsService } from "@/lib/tips";
import { X } from "lucide-react";
import InviteTipsterView from "@/components/tips/InviteTipsterView";
import { 
  GeneralOptions,
  LeagueOptions,
  GoalsOptions,
  PositionOptions,
  BookingsOptions,
  MatchResultOptions 
} from "@/lib/optionList";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TipDetailViewProps {
  tip: GeneratedTip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatGMTTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      timeZone: "GMT",
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " GMT";
  } catch {
    return "TBD";
  }
}

function getOptionName(id: string, options: { id: string; name: string }[]): string {
  return options.find(opt => opt.id === id)?.name || id;
}

function FilterBadges({ filters }: { filters: TipFilters }) {
  const badges: { label: string; value: string }[] = [];

  if (filters.general) {
    badges.push({ 
      label: "Country/General", 
      value: getOptionName(filters.general, GeneralOptions) 
    });
  }
  
  if (filters.league) {
    badges.push({ 
      label: "League", 
      value: getOptionName(filters.league, LeagueOptions) 
    });
  }
  
  if (filters.home?.goals) {
    badges.push({ 
      label: "Home Goals", 
      value: getOptionName(filters.home.goals, GoalsOptions) 
    });
  }
  if (filters.home?.result) {
    badges.push({ 
      label: "Home Result", 
      value: getOptionName(filters.home.result, MatchResultOptions) 
    });
  }
  
  if (filters.home?.position) {
    badges.push({ 
      label: "Home Position", 
      value: getOptionName(filters.home.position, PositionOptions) 
    });
  }
  
  if (filters.home?.bookings) {
    badges.push({ 
      label: "Home Bookings", 
      value: getOptionName(filters.home.bookings, BookingsOptions) 
    });
  }
  
  if (filters.home?.count !== undefined) {
    badges.push({ 
      label: "Home Count", 
      value: filters.home.count.toString() 
    });
  }
  if (filters.home?.resultCount !== undefined) {
    badges.push({ 
      label: "Home Result Count", 
      value: filters.home.resultCount.toString() 
    });
  }
  
  if (filters.away?.goals) {
    badges.push({ 
      label: "Away Goals", 
      value: getOptionName(filters.away.goals, GoalsOptions) 
    });
  }
  if (filters.away?.result) {
    badges.push({ 
      label: "Away Result", 
      value: getOptionName(filters.away.result, MatchResultOptions) 
    });
  }
  
  if (filters.away?.position) {
    badges.push({ 
      label: "Away Position", 
      value: getOptionName(filters.away.position, PositionOptions) 
    });
  }
  
  if (filters.away?.bookings) {
    badges.push({ 
      label: "Away Bookings", 
      value: getOptionName(filters.away.bookings, BookingsOptions) 
    });
  }
  
  if (filters.away?.count !== undefined) {
    badges.push({ 
      label: "Away Count", 
      value: filters.away.count.toString() 
    });
  }
  if (filters.away?.resultCount !== undefined) {
    badges.push({ 
      label: "Away Result Count", 
      value: filters.away.resultCount.toString() 
    });
  }
  
  if (filters.homeH2H?.result) {
    badges.push({ 
      label: "Home H2H", 
      value: getOptionName(filters.homeH2H.result, MatchResultOptions) 
    });
  }
  
  if (filters.homeH2H?.count !== undefined) {
    badges.push({ 
      label: "Home H2H Count", 
      value: filters.homeH2H.count.toString() 
    });
  }
  
  if (filters.awayH2H?.result) {
    badges.push({ 
      label: "Away H2H", 
      value: getOptionName(filters.awayH2H.result, MatchResultOptions) 
    });
  }
  
  if (filters.awayH2H?.count !== undefined) {
    badges.push({ 
      label: "Away H2H Count", 
      value: filters.awayH2H.count.toString() 
    });
  }

  if (badges.length === 0) {
    return (
      <div className="text-sm text-[#6b6a7a] italic">No filters applied</div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="px-3 py-1.5 rounded-full bg-[#f4d03f]/20 border border-[#f4d03f]/40 text-sm font-medium text-[#3a3947]"
        >
          <span className="text-[#6b6a7a] text-xs">{badge.label}:</span> {badge.value}
        </motion.div>
      ))}
    </div>
  );
}

function FixtureCard({ fixture, index }: { fixture: Fixture; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-xl border border-[#dddad0] bg-white hover:border-[#f4d03f] hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#f4d03f] text-[#3a3947] font-bold flex items-center justify-center text-sm">
            {index + 1}
          </div>
          <span className="text-xs text-[#6b6a7a] font-medium">Fixture #{index + 1}</span>
        </div>
        {fixture.prediction && (
          <span
            className={
              `px-2 py-1 rounded text-xs font-semibold ` +
              (fixture.prediction === "Home Win"
                ? "bg-green-100 text-green-700"
                : fixture.prediction === "Away Win"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700")
            }
          >
            {fixture.prediction}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-3">
        <div className="flex flex-col items-center gap-1">
          <div className="text-4xl leading-none">{fixture.homeTeam.logo || "🏆"}</div>
          <div className="text-sm font-semibold text-[#3a3947] text-center max-w-[140px] truncate">
            {fixture.homeTeam.name}
          </div>
        </div>
        <div className="text-center">
          <div className="px-2 py-1 rounded-md border border-[#dddad0] text-xs text-[#6b6a7a] whitespace-nowrap">
            {formatGMTTime(fixture.matchTime)}
          </div>
          <div className="mt-1 text-xs text-[#6b6a7a]">vs</div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-4xl leading-none">{fixture.awayTeam.logo || "🏆"}</div>
          <div className="text-sm font-semibold text-[#3a3947] text-center max-w-[140px] truncate">
            {fixture.awayTeam.name}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-dashed border-[#dddad0]" />

      {fixture.comments && fixture.comments.length > 0 && (
        <div className="mt-4 space-y-3">
          {fixture.comments.map((c, i) => (
            <div key={i} className="rounded-md border border-[#dddad0] bg-white p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback>{c.tipsterName.split(" ").map(w => w[0]).slice(0,2).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#3a3947]">{c.tipsterName}</span>
                    <span className="text-xs text-[#6b6a7a]">{c.tipsterRating.toFixed(1)} ★</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-[#3a3947]">{c.comment}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function TipDetailView({ tip, open, onOpenChange }: TipDetailViewProps) {
  if (!tip) return null;

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

  const [inviteOpen, setInviteOpen] = useState(false);
  const [liveTip, setLiveTip] = useState<GeneratedTip | null>(tip);

  useEffect(() => {
    setLiveTip(tip);
  }, [tip?.id]);

  useEffect(() => {
    const handler = () => {
      if (!tip) return;
      const latest = tipsService.getTipById(tip.id);
      if (latest) setLiveTip(latest);
    };
    window.addEventListener("tips-change", handler);
    return () => window.removeEventListener("tips-change", handler);
  }, [tip?.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#fefdfb] border-[#dddad0] sm:max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#dddad0]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-[#3a3947] mb-2">
                Generated Tips Details
              </DialogTitle>
              <DialogDescription className="text-[#6b6a7a]">
                Generated on {formatTime((liveTip || tip).timestamp)} • {(liveTip || tip).fixtures.length} fixture{(liveTip || tip).fixtures.length !== 1 ? "s" : ""}
              </DialogDescription>
            </div>
            <button
              onClick={() => setInviteOpen(true)}
              className="px-3 py-2 rounded-lg bg-[#f4d03f] text-[#3a3947] text-sm font-semibold hover:shadow-sm transition-colors"
            >
              Invite Tipster
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-[#dddad0] rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-[#6b6a7a]" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Filter Badges Section */}
          <div>
            <h3 className="text-lg font-semibold text-[#3a3947] mb-3">Applied Filters</h3>
            <FilterBadges filters={tip.filters} />
          </div>

          {/* Fixtures Section */}
          <div>
            <h3 className="text-lg font-semibold text-[#3a3947] mb-4">
              Fixtures ({(liveTip || tip).fixtures.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(liveTip || tip).fixtures.map((fixture, index) => (
                <FixtureCard key={fixture.id} fixture={fixture} index={index} />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
      <InviteTipsterView open={inviteOpen} onOpenChange={setInviteOpen} tip={liveTip || tip} />
    </Dialog>
  );
}

