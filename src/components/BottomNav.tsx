"use client";

import React from "react";
import { House, Cake, ListChecks, Bell, Calendar } from "@phosphor-icons/react";

export type TabType = "dashboard" | "birthdays" | "tasks" | "reminders" | "calendar";

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: "dashboard", label: "Home", icon: House },
    { id: "birthdays", label: "Birthdays", icon: Cake },
    { id: "tasks", label: "Tasks", icon: ListChecks },
    { id: "reminders", label: "Nudges", icon: Bell },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-[64px] border-t border-[#F0E6DB]/80 dark:border-[#251E19]/80 bg-white/80 dark:bg-[#14110E]/80 backdrop-blur-md px-4 flex items-center justify-around pb-safe max-w-[480px] mx-auto shadow-[0_-8px_24px_rgba(61,43,31,0.04)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all focus:outline-none touch-manipulation min-w-[44px]"
            aria-label={tab.label}
          >
            <div
              className={`p-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-poppy-blush bg-poppy-petal/20 dark:bg-poppy-petal/10 scale-105"
                  : "text-poppy-text-muted hover:text-poppy-soil"
              }`}
            >
              <Icon size={22} weight={isActive ? "fill" : "regular"} />
            </div>
            <span
              className={`text-[10px] font-medium tracking-wide mt-0.5 transition-colors duration-200 ${
                isActive ? "text-poppy-soil font-semibold" : "text-poppy-text-muted"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
