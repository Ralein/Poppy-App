"use client";

import React, { useState, useEffect } from "react";
import { usePoppyStore } from "@/store/poppyStore";
import BottomNav, { TabType } from "@/components/BottomNav";
import QuickAddModal from "@/components/QuickAddModal";
import DashboardView from "@/components/DashboardView";
import BirthdaysView from "@/components/BirthdaysView";
import TasksView from "@/components/TasksView";
import RemindersView from "@/components/RemindersView";
import CalendarView from "@/components/CalendarView";
import { Plus, Sun, Moon } from "@phosphor-icons/react";

export default function AppShell() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDefaultTab, setQuickAddDefaultTab] = useState<"birthday" | "task" | "reminder">("task");

  const { theme, toggleTheme } = usePoppyStore();

  useEffect(() => {
    setMounted(true);
    // Apply dark class on mount based on store value
    const storeTheme = usePoppyStore.getState().theme;
    const root = window.document.documentElement;
    if (storeTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FFF8F0] text-[#3D2B1F]">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-pulse">🌸</span>
          <span className="font-fraunces font-bold text-lg tracking-wide">Poppy blooming...</span>
        </div>
      </div>
    );
  }

  const handleOpenQuickAdd = (tab: "birthday" | "task" | "reminder") => {
    setQuickAddDefaultTab(tab);
    setIsQuickAddOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView onNavigate={setActiveTab} onOpenQuickAdd={handleOpenQuickAdd} />;
      case "birthdays":
        return <BirthdaysView onOpenQuickAdd={handleOpenQuickAdd} />;
      case "tasks":
        return <TasksView onOpenQuickAdd={handleOpenQuickAdd} />;
      case "reminders":
        return <RemindersView onOpenQuickAdd={handleOpenQuickAdd} />;
      case "calendar":
        return <CalendarView />;
      default:
        return <DashboardView onNavigate={setActiveTab} onOpenQuickAdd={handleOpenQuickAdd} />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      {/* simulated mobile wrapper or direct app wrapper */}
      <div className="app-container-frame w-full bg-poppy-cream dark:bg-[#14110E] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* App Header */}
        <header className="h-[56px] border-b border-poppy-petal/20 dark:border-[#251E19] bg-white/70 dark:bg-[#14110E]/70 backdrop-blur-md px-5 flex items-center justify-between z-30 select-none">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <span className="font-fraunces text-2xl font-bold tracking-tight text-poppy-soil dark:text-poppy-cream">
              Poppy
            </span>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-poppy-text-muted hover:text-poppy-soil hover:bg-poppy-mist dark:hover:bg-[#251E19] transition-all focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        {/* Dynamic Screen/View contents */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {renderActiveView()}
        </main>

        {/* Floating Action Button (FAB) - Bottom zone reachable */}
        <div className="absolute bottom-[80px] right-6 z-30">
          <button
            onClick={() => handleOpenQuickAdd("task")}
            className="w-14 h-14 rounded-full bg-poppy-blush hover:bg-poppy-blush/90 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer focus:outline-none"
            aria-label="Quick Add Item"
          >
            <Plus size={24} weight="bold" />
          </button>
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Bottom Sheet Drawer modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultTab={quickAddDefaultTab}
      />
    </div>
  );
}
