"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, Bell, Cake, MapPin, Clock, ArrowRight } from "@phosphor-icons/react";
import { usePoppyStore, AVATAR_COLORS } from "@/store/poppyStore";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "birthday" | "task" | "reminder";
}

export default function QuickAddModal({ isOpen, onClose, defaultTab = "task" }: QuickAddModalProps) {
  const [activeTab, setActiveTab] = useState<"birthday" | "task" | "reminder">(defaultTab);
  const modalRef = useRef<HTMLDivElement>(null);

  // Zustand Actions
  const { addBirthday, addTask, addReminder } = usePoppyStore();

  // Common Form States
  const [title, setTitle] = useState("");

  // Birthday States
  const [bdayDate, setBdayDate] = useState("");
  const [bdayRelation, setBdayRelation] = useState<"Family" | "Friend" | "Colleague" | "Partner" | "Other">("Friend");
  const [bdayLeadTime, setBdayLeadTime] = useState<number>(3);

  // Task States
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [taskDueTime, setTaskDueTime] = useState("");
  const [taskPriority, setTaskPriority] = useState<"Gentle" | "Important" | "Urgent">("Gentle");
  const [taskTags, setTaskTags] = useState("");
  const [taskRecur, setTaskRecur] = useState<"daily" | "weekly" | "monthly" | "none">("none");

  // Reminder States
  const [remDate, setRemDate] = useState("");
  const [remTime, setRemTime] = useState("");
  const [remLoc, setRemLoc] = useState("");
  const [remRecur, setRemRecur] = useState(false);

  // Reset states when open/tab changes
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setBdayDate("");
      setBdayRelation("Friend");
      setBdayLeadTime(3);
      setTaskDueDate(new Date().toISOString().split("T")[0]);
      setTaskDueTime("");
      setTaskPriority("Gentle");
      setTaskTags("");
      setTaskRecur("none");
      setRemDate("");
      setRemTime("");
      setRemLoc("");
      setRemRecur(false);
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (activeTab === "birthday") {
      // If date is YYYY-MM-DD, convert to MM-DD
      const rawDate = bdayDate; // e.g. "2026-06-12"
      let formattedDate = "06-12"; // default fallback
      if (rawDate) {
        const parts = rawDate.split("-");
        if (parts.length === 3) {
          formattedDate = `${parts[1]}-${parts[2]}`; // MM-DD
        } else if (parts.length === 2) {
          formattedDate = rawDate;
        }
      }
      const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      addBirthday({
        name: title,
        date: formattedDate,
        relationship: bdayRelation,
        reminderLeadTime: bdayLeadTime,
        giftIdeas: [],
        avatarColor: randomColor,
      });
    } else if (activeTab === "task") {
      addTask({
        title,
        dueDate: taskDueDate || new Date().toISOString().split("T")[0],
        dueTime: taskDueTime || undefined,
        priority: taskPriority,
        tags: taskTags ? taskTags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        recurrence: taskRecur,
      });
    } else if (activeTab === "reminder") {
      addReminder({
        title,
        date: remDate || undefined,
        time: remTime || undefined,
        location: remLoc || undefined,
        recurring: remRecur,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3D2B1F]/30 dark:bg-black/60 backdrop-blur-sm flex items-end justify-center">
      {/* Sliding sheet */}
      <div
        ref={modalRef}
        className="w-full max-w-[480px] bg-poppy-cream dark:bg-[#14110E] rounded-t-[28px] shadow-2xl p-6 border-t border-poppy-petal/20 animate-[slide-up_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards] max-h-[90vh] overflow-y-auto"
      >
        {/* Handle for swipe look */}
        <div className="w-12 h-1.5 bg-poppy-text-muted/20 dark:bg-poppy-text-muted/10 rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-fraunces text-2xl font-bold text-poppy-soil dark:text-poppy-cream">
            Add Something 🌸
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-poppy-mist dark:hover:bg-poppy-mist/10 text-poppy-text-muted"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="flex bg-poppy-mist/60 dark:bg-[#251E19] p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("task")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "task"
                ? "bg-white dark:bg-[#14110E] text-poppy-soil dark:text-poppy-cream shadow-sm"
                : "text-poppy-text-muted hover:text-poppy-soil"
            }`}
          >
            <Calendar size={18} />
            Task
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("birthday")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "birthday"
                ? "bg-white dark:bg-[#14110E] text-poppy-soil dark:text-poppy-cream shadow-sm"
                : "text-poppy-text-muted hover:text-poppy-soil"
            }`}
          >
            <Cake size={18} />
            Birthday
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reminder")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "reminder"
                ? "bg-white dark:bg-[#14110E] text-poppy-soil dark:text-poppy-cream shadow-sm"
                : "text-poppy-text-muted hover:text-poppy-soil"
            }`}
          >
            <Bell size={18} />
            Nudge
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Main Title input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted">
              {activeTab === "birthday"
                ? "Whose birthday is it?"
                : activeTab === "task"
                ? "What needs doing?"
                : "What shall I nudge you about?"}
            </label>
            <input
              type="text"
              required
              placeholder={
                activeTab === "birthday"
                  ? "Maya Lin..."
                  : activeTab === "task"
                  ? "Water the balcony seeds..."
                  : "Pick up the parcel..."
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-poppy-petal/30 dark:border-poppy-text-muted/20 bg-white dark:bg-[#1C1713] text-poppy-soil dark:text-poppy-cream placeholder:text-poppy-text-muted/50 focus:outline-none focus:ring-2 focus:ring-poppy-blush/40 text-base"
              maxLength={60}
            />
          </div>

          {/* DYNAMIC BIRTHDAY FIELDS */}
          {activeTab === "birthday" && (
            <div className="space-y-4 animate-[fade-in_0.2s_ease-out]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted flex items-center gap-1">
                    <Calendar size={14} /> Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bdayDate}
                    onChange={(e) => setBdayDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-poppy-petal/30 dark:border-poppy-text-muted/20 bg-white dark:bg-[#1C1713] text-poppy-soil dark:text-poppy-cream focus:outline-none focus:ring-2 focus:ring-poppy-blush/40 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted flex items-center gap-1">
                    <Bell size={14} /> Alert Lead-Time
                  </label>
                  <select
                    value={bdayLeadTime}
                    onChange={(e) => setBdayLeadTime(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-poppy-petal/30 dark:border-poppy-text-muted/20 bg-white dark:bg-[#1C1713] text-poppy-soil dark:text-poppy-cream focus:outline-none focus:ring-2 focus:ring-poppy-blush/40 text-sm"
                  >
                    <option value={0}>On the Day</option>
                    <option value={1}>1 Day before</option>
                    <option value={3}>3 Days before</option>
                    <option value={7}>7 Days before</option>
                  </select>
                </div>
              </div>

              {/* Relationship pills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted">
                  Relationship
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["Partner", "Family", "Friend", "Colleague", "Other"] as const).map((rel) => (
                    <button
                      type="button"
                      key={rel}
                      onClick={() => setBdayRelation(rel)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        bdayRelation === rel
                          ? "bg-poppy-blush border-poppy-blush text-white shadow-sm"
                          : "bg-white dark:bg-[#1C1713] border-poppy-petal/30 dark:border-poppy-text-muted/20 text-poppy-text-muted hover:text-poppy-soil"
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC TASK FIELDS */}
          {activeTab === "task" && (
            <div className="space-y-4 animate-[fade-in_0.2s_ease-out]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted flex items-center gap-1">
                    <Calendar size={14} /> Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-poppy-petal/30 dark:border-poppy-text-muted/20 bg-white dark:bg-[#1C1713] text-poppy-soil dark:text-poppy-cream focus:outline-none focus:ring-2 focus:ring-poppy-blush/40 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted flex items-center gap-1">
                    <Clock size={14} /> Optional Time
                  </label>
                  <input
                    type="time"
                    value={taskDueTime}
                    onChange={(e) => setTaskDueTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-poppy-petal/30 dark:border-poppy-text-muted/20 bg-white dark:bg-[#1C1713] text-poppy-soil dark:text-poppy-cream focus:outline-none focus:ring-2 focus:ring-poppy-blush/40 text-sm"
                  />
                </div>
              </div>

              {/* Priority levels */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "🌸 Gentle", val: "Gentle" as const },
                    { label: "🌺 Important", val: "Important" as const },
                    { label: "🔴 Urgent", val: "Urgent" as const },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.val}
                      onClick={() => setTaskPriority(p.val)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border text-center transition-all ${
                        taskPriority === p.val
                          ? p.val === "Gentle"
                            ? "bg-poppy-leaf/20 border-poppy-stem text-poppy-stem"
                            : p.val === "Important"
                            ? "bg-poppy-amber/20 border-poppy-amber text-poppy-amber"
                            : "bg-poppy-blush/20 border-poppy-blush text-poppy-blush"
                          : "bg-white dark:bg-[#1C1713] border-poppy-petal/30 dark:border-poppy-text-muted/20 text-poppy-text-muted"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recurrence Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted">
                    Repeat
                  </label>
                  <select
                    value={taskRecur}
                    onChange={(e) => setTaskRecur(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-poppy-petal/30 dark:border-poppy-text-muted/20 bg-white dark:bg-[#1C1713] text-poppy-soil dark:text-poppy-cream focus:outline-none focus:ring-2 focus:ring-poppy-blush/40 text-sm"
                  >
                    <option value="none">Does not repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Home, Personal..."
                    value={taskTags}
                    onChange={(e) => setTaskTags(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-poppy-petal/30 dark:border-poppy-text-muted/20 bg-white dark:bg-[#1C1713] text-poppy-soil dark:text-poppy-cream focus:outline-none focus:ring-2 focus:ring-poppy-blush/40 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC REMINDER FIELDS */}
          {activeTab === "reminder" && (
            <div className="space-y-4 animate-[fade-in_0.2s_ease-out]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted flex items-center gap-1">
                    <Calendar size={14} /> Optional Date
                  </label>
                  <input
                    type="date"
                    value={remDate}
                    onChange={(e) => setRemDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-poppy-petal/30 dark:border-poppy-text-muted/20 bg-white dark:bg-[#1C1713] text-poppy-soil dark:text-poppy-cream focus:outline-none focus:ring-2 focus:ring-poppy-blush/40 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted flex items-center gap-1">
                    <Clock size={14} /> Nudge Time
                  </label>
                  <input
                    type="time"
                    value={remTime}
                    onChange={(e) => setRemTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-poppy-petal/30 dark:border-poppy-text-muted/20 bg-white dark:bg-[#1C1713] text-poppy-soil dark:text-poppy-cream focus:outline-none focus:ring-2 focus:ring-poppy-blush/40 text-sm"
                  />
                </div>
              </div>

              {/* Location Context */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-poppy-text-muted flex items-center gap-1">
                  <MapPin size={14} /> Location Nudge Context (Optional)
                </label>
                <input
                  type="text"
                  placeholder="When near the grocery store, pharmacy..."
                  value={remLoc}
                  onChange={(e) => setRemLoc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-poppy-petal/30 dark:border-poppy-text-muted/20 bg-white dark:bg-[#1C1713] text-poppy-soil dark:text-poppy-cream focus:outline-none focus:ring-2 focus:ring-poppy-blush/40 text-sm"
                />
              </div>

              {/* Recurring Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-poppy-mist/40 dark:bg-poppy-mist/5 border border-poppy-petal/10">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-poppy-soil dark:text-poppy-cream">Recurring Nudge</span>
                  <span className="text-xs text-poppy-text-muted">Repeat this reminder periodically</span>
                </div>
                <input
                  type="checkbox"
                  checked={remRecur}
                  onChange={(e) => setRemRecur(e.target.checked)}
                  className="w-10 h-5 bg-poppy-text-muted/30 checked:bg-poppy-blush rounded-full cursor-pointer focus:outline-none transition-colors border-2 border-transparent"
                />
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 bg-poppy-blush text-white rounded-[14px] text-sm font-bold flex items-center justify-center gap-2 hover:bg-poppy-blush/90 active:scale-[0.98] transition-all shadow-md shadow-poppy-blush/10 cursor-pointer"
            >
              Add to Poppy
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
