import { useState, useCallback } from "react";

export type ActiveTab = "explorer" | "planner";

interface UseTabReturn {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export function useTab(initial: ActiveTab = "explorer"): UseTabReturn {
  const [activeTab, setActiveTab] = useState<ActiveTab>(initial);
  const switchTab = useCallback(
    (tab: ActiveTab) => setActiveTab(tab),
    []
  );
  return { activeTab, setActiveTab: switchTab };
}
