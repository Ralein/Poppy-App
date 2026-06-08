"use client";

import React, { useMemo } from "react";
import { usePoppyStore, Reminder } from "@/store/poppyStore";
import { Bell, MapPin, Clock, Trash, Plus, Sparkle, Circle, CheckCircle } from "@phosphor-icons/react";

interface RemindersViewProps {
  onOpenQuickAdd: (tab: "birthday" | "task" | "reminder") => void;
}

export default function RemindersView({ onOpenQuickAdd }: RemindersViewProps) {
  const { reminders, toggleReminder, deleteReminder, addReminder } = usePoppyStore();

  const activeReminders = useMemo(() => {
    return reminders.filter((r) => !r.completed);
  }, [reminders]);

  const completedReminders = useMemo(() => {
    return reminders.filter((r) => r.completed);
  }, [reminders]);

  // Sunday evening smart recommendation check
  const showSundayRecommendation = useMemo(() => {
    const today = new Date();
    // Sunday is 0
    return today.getDay() === 0 && today.getHours() >= 16;
  }, []);

  const handleApplySuggestion = (text: string) => {
    addReminder({
      title: text,
      time: "20:00",
      recurring: true,
    });
    alert(`Added reminder nudge: "${text}" scheduled for 8 PM Sunday evening 🌸`);
  };

  return (
    <div className="flex flex-col gap-5 p-5 pb-24 overflow-y-auto w-full max-w-[480px] mx-auto select-none">
      {/* View Header */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold tracking-wider uppercase text-poppy-text-muted">
            Gentle Nudges
          </span>
          <h1 className="font-fraunces text-3xl font-extrabold text-poppy-soil dark:text-poppy-cream mt-0.5">
            Reminders 🔔
          </h1>
        </div>
        <button
          onClick={() => onOpenQuickAdd("reminder")}
          className="w-10 h-10 rounded-full bg-poppy-blush hover:bg-poppy-blush/90 text-white flex items-center justify-center shadow-md active:scale-95 transition-all focus:outline-none"
          aria-label="Add Reminder"
        >
          <Plus size={20} weight="bold" />
        </button>
      </div>

      {/* Smart Suggestions Panel */}
      <div className="bg-gradient-to-br from-poppy-amber/10 to-poppy-petal/5 dark:from-poppy-amber/20 dark:to-poppy-petal/5 rounded-[20px] p-5 border border-poppy-amber/20 space-y-3 animate-[fade-in_0.3s_ease-out]">
        <div className="flex items-center gap-1.5 text-poppy-amber font-bold text-xs uppercase tracking-wider">
          <Sparkle size={16} weight="fill" />
          <span>Poppy Nudge Suggestions</span>
        </div>
        <p className="text-xs text-poppy-soil/90 dark:text-poppy-cream/90 leading-relaxed">
          {showSundayRecommendation
            ? "Sunday evening is here. It's the perfect time to prepare for the week. Would you like a nudge to plan ahead?"
            : "Often added reminders on Sunday evenings: Plan weekly meals, water balcony ferns, journal thoughts."}
        </p>
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={() => handleApplySuggestion("Water balcony ferns 🌿")}
            className="w-full text-left px-3 py-2 bg-white/70 dark:bg-[#1C1713]/70 hover:bg-white dark:hover:bg-[#1C1713] text-xs font-semibold text-poppy-soil dark:text-poppy-cream rounded-xl border border-poppy-petal/10 flex items-center justify-between"
          >
            <span>Water balcony ferns 🌿</span>
            <span className="text-[10px] text-poppy-amber font-bold font-mono">8 PM Weekly</span>
          </button>
          <button
            onClick={() => handleApplySuggestion("Write in gratitude journal 🌸")}
            className="w-full text-left px-3 py-2 bg-white/70 dark:bg-[#1C1713]/70 hover:bg-white dark:hover:bg-[#1C1713] text-xs font-semibold text-poppy-soil dark:text-poppy-cream rounded-xl border border-poppy-petal/10 flex items-center justify-between"
          >
            <span>Write in gratitude journal 🌸</span>
            <span className="text-[10px] text-poppy-amber font-bold font-mono">9 PM Sunday</span>
          </button>
        </div>
      </div>

      {/* Active Nudges */}
      <div className="space-y-3">
        <h3 className="font-fraunces text-lg font-bold text-poppy-soil dark:text-poppy-cream px-1">
          Active Nudges ({activeReminders.length})
        </h3>

        {activeReminders.length === 0 ? (
          <div className="text-center py-8 bg-poppy-mist/30 dark:bg-poppy-mist/5 rounded-[20px] p-6 border border-poppy-petal/5">
            <p className="text-xs text-poppy-text-muted italic">No active nudges. Create one to stay gently nudged. 🌸</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeReminders.map((rem) => renderReminderRow(rem))}
          </div>
        )}
      </div>

      {/* Completed Nudges */}
      {completedReminders.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="font-fraunces text-lg font-bold text-poppy-text-muted px-1">
            Cleared Nudges ({completedReminders.length})
          </h3>
          <div className="space-y-3 opacity-60">
            {completedReminders.map((rem) => renderReminderRow(rem))}
          </div>
        </div>
      )}
    </div>
  );

  function renderReminderRow(rem: Reminder) {
    return (
      <div
        key={rem.id}
        className="bg-white dark:bg-[#1C1713] rounded-2xl p-4 shadow-sm border border-poppy-petal/5 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleReminder(rem.id)}
            className="text-poppy-amber hover:scale-105 active:scale-95 transition-all p-1"
          >
            {rem.completed ? (
              <CheckCircle size={22} weight="fill" className="text-poppy-stem" />
            ) : (
              <Circle size={22} className="text-poppy-amber" />
            )}
          </button>
          <div className="flex flex-col gap-0.5">
            <span
              className={`text-sm font-semibold leading-snug ${
                rem.completed ? "line-through text-poppy-text-muted font-normal" : "text-poppy-soil dark:text-poppy-cream"
              }`}
            >
              {rem.title}
            </span>
            <div className="flex items-center gap-2.5 pt-0.5 text-xs text-poppy-text-muted font-medium">
              {rem.time && (
                <span className="flex items-center gap-0.5 font-mono">
                  <Clock size={12} /> {rem.time}
                </span>
              )}
              {rem.date && (
                <span className="flex items-center gap-0.5 font-mono">
                  📅 {rem.date}
                </span>
              )}
              {rem.location && (
                <span className="flex items-center gap-0.5 text-poppy-stem">
                  <MapPin size={12} /> {rem.location}
                </span>
              )}
              {rem.recurring && (
                <span className="text-[9px] font-bold uppercase tracking-wide text-poppy-blush bg-poppy-petal/10 px-1.5 py-0.5 rounded-full">
                  Recurring
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => deleteReminder(rem.id)}
          className="p-2 text-poppy-text-muted hover:text-poppy-blush hover:bg-poppy-mist dark:hover:bg-poppy-mist/10 rounded-full transition-colors"
          aria-label="Delete Reminder"
        >
          <Trash size={16} />
        </button>
      </div>
    );
  }
}
