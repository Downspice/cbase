"use client";

import { useState, useEffect, useCallback } from "react";
import { tipsService, GeneratedTip } from "@/lib/tips";

export function useTips() {
  const [tips, setTips] = useState<GeneratedTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkTips = useCallback(() => {
    const allTips = tipsService.getTips();
    setTips(allTips);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Load tips on mount
    checkTips();

    // Listen for tip changes
    const handleTipsChange = () => {
      checkTips();
    };

    window.addEventListener("tips-change", handleTipsChange);

    return () => {
      window.removeEventListener("tips-change", handleTipsChange);
    };
  }, [checkTips]);

  const generateTip = (filters: any) => {
    const tip = tipsService.generateTip(filters);
    checkTips();
    return tip;
  };

  const deleteTip = (tipId: string) => {
    tipsService.deleteTip(tipId);
    checkTips();
  };

  const clearAll = () => {
    tipsService.clearAllTips();
    checkTips();
  };

  return {
    tips,
    isLoading,
    generateTip,
    deleteTip,
    clearAll,
    refresh: checkTips,
  };
}

