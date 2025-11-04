// Tips storage utility functions using local storage

export interface Team {
  name: string;
  logo?: string;
}

export interface Fixture {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  matchTime: string; // ISO string for GMT time
  prediction?: string;
  comments?: TipsterComment[];
}

export interface TipsterComment {
  tipsterId: string;
  tipsterName: string;
  tipsterRating: number;
  tipsterAvatar?: string;
  comment: string;
}

export interface TipFilters {
  general?: string;
  home?: {
    result?: string;
    resultCount?: number;
    goals?: string;
    position?: string;
    bookings?: string;
    count?: number;
  };
  away?: {
    result?: string;
    resultCount?: number;
    goals?: string;
    position?: string;
    bookings?: string;
    count?: number;
  };
  homeH2H?: {
    result?: string;
    count?: number;
  };
  awayH2H?: {
    result?: string;
    count?: number;
  };
  league?: string;
}

export interface GeneratedTip {
  id: string;
  timestamp: number;
  filters: TipFilters;
  fixtures: Fixture[];
  status: "pending" | "completed";
  assignedTipsterId?: string;
  assignedTipsterName?: string;
  assignedTipsterRating?: number;
}

const TIPS_KEY = "tbase_generated_tips";

// Mock team data with actual logo image URLs where possible (public sources)
const TEAM_LOGOS: Record<string, string> = {
  "Man Utd": "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  "Man City": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  "Chelsea": "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
  "Arsenal": "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  "Liverpool": "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
  "Tottenham": "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
  "Barcelona": "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  "Real Madrid": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  "PSG": "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
  "Bayern Munich": "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
  "Juventus": "https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg",
  "AC Milan": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg",
  "Inter Milan": "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2014.svg",
  "Atletico Madrid": "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg",
  "Borussia Dortmund": "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
};

const TEAM_NAMES = Object.keys(TEAM_LOGOS);

// Generate random fixtures for demo
function generateMockFixtures(count: number): Fixture[] {
  const fixtures: Fixture[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Random time in next 7 days
    const matchDate = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
    matchDate.setHours(Math.floor(Math.random() * 12) + 12, Math.floor(Math.random() * 60), 0);
    
    const homeTeamName = TEAM_NAMES[Math.floor(Math.random() * TEAM_NAMES.length)];
    let awayTeamName = TEAM_NAMES[Math.floor(Math.random() * TEAM_NAMES.length)];
    // Ensure teams are different
    while (awayTeamName === homeTeamName) {
      awayTeamName = TEAM_NAMES[Math.floor(Math.random() * TEAM_NAMES.length)];
    }
    
    fixtures.push({
      id: `fixture-${Date.now()}-${i}`,
      homeTeam: {
        name: homeTeamName,
        logo: TEAM_LOGOS[homeTeamName],
      },
      awayTeam: {
        name: awayTeamName,
        logo: TEAM_LOGOS[awayTeamName],
      },
      matchTime: matchDate.toISOString(),
      prediction: ["Home Win", "Away Win", "Draw"][Math.floor(Math.random() * 3)],
    });
  }
  
  return fixtures;
}

export const tipsService = {
  // Get all generated tips
  getTips(): GeneratedTip[] {
    if (typeof window === "undefined") return [];
    const tipsData = localStorage.getItem(TIPS_KEY);
    if (!tipsData) return [];
    try {
      return JSON.parse(tipsData);
    } catch {
      return [];
    }
  },

  // Get a single tip by ID
  getTipById(id: string): GeneratedTip | null {
    const tips = this.getTips();
    return tips.find(tip => tip.id === id) || null;
  },

  // Generate a new tip (called when user clicks Generate Tips)
  generateTip(filters: TipFilters): GeneratedTip {
    if (typeof window === "undefined") {
      throw new Error("Cannot generate tips on server");
    }

    const fixtureCount = Math.floor(Math.random() * 10) + 5; // 5-14 fixtures
    const fixtures = generateMockFixtures(fixtureCount);
    
    const tip: GeneratedTip = {
      id: `tip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      filters,
      fixtures,
      status: "completed", // For demo, immediately completed
    };

    const allTips = this.getTips();
    allTips.unshift(tip); // Add to beginning (most recent first)
    
    // Keep only last 50 tips
    const limitedTips = allTips.slice(0, 50);
    
    localStorage.setItem(TIPS_KEY, JSON.stringify(limitedTips));
    
    // Dispatch custom event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("tips-change"));
    }

    return tip;
  },

  // Delete a tip
  deleteTip(tipId: string): void {
    if (typeof window === "undefined") return;
    const tips = this.getTips();
    const filteredTips = tips.filter(tip => tip.id !== tipId);
    localStorage.setItem(TIPS_KEY, JSON.stringify(filteredTips));
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("tips-change"));
    }
  },

  // Clear all tips
  clearAllTips(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TIPS_KEY, JSON.stringify([]));
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("tips-change"));
    }
  },

  // Add a tipster review to each fixture for a given tip
  addTipsterReview(
    tipId: string,
    tipster: { id: string; name: string; rating: number; avatar?: string },
    generateComment?: (fixture: Fixture) => string
  ): void {
    if (typeof window === "undefined") return;
    const tips = this.getTips();
    const idx = tips.findIndex(t => t.id === tipId);
    if (idx === -1) return;
    const tip = tips[idx];
    const makeComment = generateComment || ((fixture: Fixture) => `Insight: ${fixture.prediction || "Review"} looks solid given recent form.`);
    const updatedFixtures = tip.fixtures.map(fx => ({
      ...fx,
      comments: [
        ...(fx.comments || []),
        {
          tipsterId: tipster.id,
          tipsterName: tipster.name,
          tipsterRating: tipster.rating,
          tipsterAvatar: tipster.avatar,
          comment: makeComment(fx),
        },
      ],
    }));
    const updatedTip: GeneratedTip = { ...tip, fixtures: updatedFixtures };
    const newTips = [...tips];
    newTips[idx] = updatedTip;
    localStorage.setItem(TIPS_KEY, JSON.stringify(newTips));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("tips-change"));
    }
  },

  assignTipToTipster(
    tipId: string,
    tipster: { id: string; name: string; rating: number }
  ): void {
    if (typeof window === "undefined") return;
    const tips = this.getTips();
    const idx = tips.findIndex(t => t.id === tipId);
    if (idx === -1) return;
    const tip = tips[idx];
    const updatedTip: GeneratedTip = {
      ...tip,
      assignedTipsterId: tipster.id,
      assignedTipsterName: tipster.name,
      assignedTipsterRating: tipster.rating,
    };
    const newTips = [...tips];
    newTips[idx] = updatedTip;
    localStorage.setItem(TIPS_KEY, JSON.stringify(newTips));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("tips-change"));
    }
  },

  addTipsterReviewWithComments(
    tipId: string,
    tipster: { id: string; name: string; rating: number; avatar?: string },
    commentsByFixtureId: Record<string, string>
  ): void {
    if (typeof window === "undefined") return;
    const tips = this.getTips();
    const idx = tips.findIndex(t => t.id === tipId);
    if (idx === -1) return;
    const tip = tips[idx];
    const updatedFixtures = tip.fixtures.map(fx => ({
      ...fx,
      comments: [
        ...(fx.comments || []),
        commentsByFixtureId[fx.id]
          ? {
              tipsterId: tipster.id,
              tipsterName: tipster.name,
              tipsterRating: tipster.rating,
              tipsterAvatar: tipster.avatar,
              comment: commentsByFixtureId[fx.id],
            }
          : undefined,
      ].filter(Boolean) as TipsterComment[],
    }));
    const updatedTip: GeneratedTip = { ...tip, fixtures: updatedFixtures };
    const newTips = [...tips];
    newTips[idx] = updatedTip;
    localStorage.setItem(TIPS_KEY, JSON.stringify(newTips));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("tips-change"));
    }
  },
};

