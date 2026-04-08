import { cn } from "../lib/utils";
import { ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn("tab-item", activeTab === tab.id && "active")}
          onClick={() => onTabChange(tab.id)}
          type="button"
        >
          {tab.icon && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                opacity: activeTab === tab.id ? 1 : 0.7,
              }}
            >
              {tab.icon}
            </span>
          )}
          <span>{tab.label}</span>
          {tab.badge && (
            <span
              style={{
                backgroundColor:
                  activeTab === tab.id
                    ? "rgba(59,130,246,0.2)"
                    : "rgba(255,255,255,0.06)",
                color:
                  activeTab === tab.id ? "#60a5fa" : "#71717a",
                borderRadius: "9999px",
                fontSize: "0.625rem",
                fontWeight: 600,
                padding: "1px 6px",
                letterSpacing: "0.02em",
              }}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
