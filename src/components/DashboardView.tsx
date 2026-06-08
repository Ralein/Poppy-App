"use client";

import React, { useMemo } from "react";
import { usePoppyStore } from "@/store/poppyStore";
import { Calendar, Cake, Bell, Sparkle, Fire } from "@phosphor-icons/react";

interface DashboardViewProps {
  onNavigate: (tab: "dashboard" | "birthdays" | "tasks" | "reminders" | "calendar") => void;
  onOpenQuickAdd: (tab: "birthday" | "task" | "reminder") => void;
}

export default function DashboardView({ onNavigate, onOpenQuickAdd }: DashboardViewProps) {
  const { tasks, birthdays, reminders, streak } = usePoppyStore();

  // 1. Time-of-day greeting
  const greeting = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning! Here's your day 🌸";
    if (hr < 17) return "Good afternoon! Breathe easy 🌿";
    return "Good evening! Rest well tonight ✨";
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Today's Tasks
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate === todayStr);
  }, [tasks, todayStr]);

  const openTodayTasks = useMemo(() => todayTasks.filter((t) => !t.completed), [todayTasks]);

  // Upcoming Birthdays
  const upcomingBirthdays = useMemo(() => {
    // Sort birthdays by closest date
    const today = new Date();
    const currentYear = today.getFullYear();

    return [...birthdays]
      .map((b) => {
        const [month, day] = b.date.split("-").map(Number);
        let bdayDate = new Date(currentYear, month - 1, day);
        if (bdayDate.getTime() < today.getTime() - 24 * 60 * 60 * 1000) {
          bdayDate = new Date(currentYear + 1, month - 1, day);
        }
        const diffTime = bdayDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...b, daysRemaining: diffDays };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [birthdays]);

  const nextBirthday = upcomingBirthdays[0];

  // Active Reminders
  const activeReminders = useMemo(() => {
    return reminders.filter((r) => !r.completed).slice(0, 3);
  }, [reminders]);

  return (
    <div className="flex flex-col gap-6 p-5 pb-24 overflow-y-auto w-full max-w-[480px] mx-auto select-none">
      {/* Dynamic Greeting */}
      <div className="mt-4 animate-[fade-in_0.4s_ease-out]">
        <span className="text-sm font-semibold tracking-wider uppercase text-poppy-text-muted">
          Poppy Companion
        </span>
        <h1 className="font-fraunces text-3xl font-extrabold text-poppy-soil dark:text-poppy-cream mt-1 leading-tight">
          {greeting}
        </h1>
      </div>

      {/* Streak Tracker Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-poppy-blush/10 to-poppy-petal/10 dark:from-poppy-blush/20 dark:to-poppy-petal/5 rounded-[20px] p-5 border border-poppy-petal/20 flex items-center justify-between shadow-sm">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-1.5 text-poppy-blush">
            <Fire size={20} weight="fill" />
            <span className="text-sm font-bold uppercase tracking-wider">Streak Tracker</span>
          </div>
          <p className="text-poppy-soil dark:text-poppy-cream font-fraunces text-xl font-bold">
            {streak} {streak === 1 ? "day" : "days"} in a row!
          </p>
          <p className="text-xs text-poppy-text-muted">Keep checking off your daily tasks 🌸</p>
        </div>
        <div className="text-poppy-blush/20 dark:text-poppy-blush/10 transform rotate-12 scale-150 absolute right-4 bottom-2 pointer-events-none">
          <Fire size={80} weight="fill" />
        </div>
      </div>

      {/* Today's Agenda Card */}
      <div className="bg-poppy-mist/60 dark:bg-poppy-mist/5 rounded-[20px] p-5 border border-poppy-petal/10 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-fraunces text-lg font-bold text-poppy-soil dark:text-poppy-cream flex items-center gap-2">
            <Calendar className="text-poppy-stem" size={20} />
            Today&apos;s Tasks
          </h3>
          <button
            onClick={() => onNavigate("tasks")}
            className="text-xs font-bold text-poppy-stem hover:underline focus:outline-none"
          >
            View All
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="text-center py-4 bg-white/50 dark:bg-[#1C1713]/50 rounded-[14px] p-4">
            <p className="text-sm text-poppy-text-muted italic">Your day is wide open. Breathe easy 🌿</p>
            <button
              onClick={() => onOpenQuickAdd("task")}
              className="mt-2 text-xs font-bold text-poppy-blush bg-poppy-petal/20 px-3 py-1.5 rounded-full hover:bg-poppy-petal/30 active:scale-95 transition-all focus:outline-none"
            >
              Add a task
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 bg-white/70 dark:bg-[#1C1713]/70 p-3 rounded-[14px] border border-poppy-petal/5"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    t.priority === "Urgent"
                      ? "bg-poppy-blush"
                      : t.priority === "Important"
                      ? "bg-poppy-amber"
                      : "bg-poppy-leaf"
                  }`}
                />
                <span
                  className={`text-sm font-semibold truncate ${
                    t.completed
                      ? "line-through text-poppy-text-muted font-normal"
                      : "text-poppy-soil dark:text-poppy-cream"
                  }`}
                >
                  {t.title}
                </span>
                {t.completed && (
                  <span className="text-[10px] bg-poppy-leaf/20 text-poppy-stem px-2 py-0.5 rounded-full font-bold ml-auto">
                    Done
                  </span>
                )}
              </div>
            ))}
            {openTodayTasks.length > 0 && (
              <p className="text-xs text-poppy-text-muted text-center pt-1">
                You have {openTodayTasks.length} pending items for today.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Closest Upcoming Birthday Card */}
      {nextBirthday && (
        <div className="bg-poppy-mist/60 dark:bg-poppy-mist/5 rounded-[20px] p-5 border border-poppy-petal/10 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-fraunces text-lg font-bold text-poppy-soil dark:text-poppy-cream flex items-center gap-2">
              <Cake className="text-poppy-blush" size={20} />
              Up Next
            </h3>
            <button
              onClick={() => onNavigate("birthdays")}
              className="text-xs font-bold text-poppy-blush hover:underline focus:outline-none"
            >
              All Birthdays
            </button>
          </div>

          <div className="flex items-center gap-4 bg-white/70 dark:bg-[#1C1713]/70 p-4 rounded-[16px] border border-poppy-petal/5 relative overflow-hidden">
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-sm font-fraunces text-lg"
              style={{ backgroundColor: nextBirthday.avatarColor }}
            >
              {nextBirthday.name.charAt(0)}
            </div>

            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-poppy-soil dark:text-poppy-cream text-base">
                  {nextBirthday.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-poppy-petal/20 text-poppy-blush font-bold uppercase tracking-wider">
                  {nextBirthday.relationship}
                </span>
              </div>
              <p className="text-xs text-poppy-text-muted">
                {nextBirthday.date.split("-")[0] === "06" ? "June" : "July"} {nextBirthday.date.split("-")[1]}
              </p>
              <p className="text-sm text-poppy-blush font-semibold font-fraunces">
                {nextBirthday.daysRemaining === 0 ? "Today! 🎂" : `${nextBirthday.name}'s birthday in ${nextBirthday.daysRemaining} days 🌸`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Nudges (Reminders) Card */}
      <div className="bg-poppy-mist/60 dark:bg-poppy-mist/5 rounded-[20px] p-5 border border-poppy-petal/10 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-fraunces text-lg font-bold text-poppy-soil dark:text-poppy-cream flex items-center gap-2">
            <Bell className="text-poppy-amber" size={20} />
            Reminders
          </h3>
          <button
            onClick={() => onNavigate("reminders")}
            className="text-xs font-bold text-poppy-amber hover:underline focus:outline-none"
          >
            All Nudges
          </button>
        </div>

        {activeReminders.length === 0 ? (
          <div className="text-center py-4 bg-white/50 dark:bg-[#1C1713]/50 rounded-[14px] p-4">
            <p className="text-sm text-poppy-text-muted italic">No active nudges right now. 🔔</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeReminders.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between bg-white/70 dark:bg-[#1C1713]/70 p-3.5 rounded-[14px] border border-poppy-petal/5"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-poppy-soil dark:text-poppy-cream">
                    {r.title}
                  </span>
                  <span className="text-xs text-poppy-text-muted flex items-center gap-1">
                    {r.time && <span>{r.time}</span>}
                    {r.location && <span>📍 {r.location}</span>}
                  </span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-poppy-amber animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
