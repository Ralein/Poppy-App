"use client";

import React, { useState, useMemo } from "react";
import { usePoppyStore, Birthday } from "@/store/poppyStore";
import { Cake, Gift, Plus, Trash, WhatsappLogo, CalendarPlus, MagnifyingGlass, Funnel } from "@phosphor-icons/react";

interface BirthdaysViewProps {
  onOpenQuickAdd: (tab: "birthday" | "task" | "reminder") => void;
}

export default function BirthdaysView({ onOpenQuickAdd }: BirthdaysViewProps) {
  const { birthdays, deleteBirthday, updateBirthday, addTask } = usePoppyStore();
  const [search, setSearch] = useState("");
  const [filterRelation, setFilterRelation] = useState<string>("All");
  const [activeGiftIndex, setActiveGiftIndex] = useState<string | null>(null);
  const [newGiftText, setNewGiftText] = useState("");

  // Calculate days remaining and sort
  const processedBirthdays = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();

    return birthdays
      .map((b) => {
        const [month, day] = b.date.split("-").map(Number);
        let bdayDate = new Date(currentYear, month - 1, day);
        // If the birthday already happened this year, calculate for next year
        if (bdayDate.getTime() < today.getTime() - 24 * 60 * 60 * 1000) {
          bdayDate = new Date(currentYear + 1, month - 1, day);
        }
        const diffTime = bdayDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...b, daysRemaining: diffDays };
      })
      .filter((b) => {
        const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filterRelation === "All" || b.relationship === filterRelation;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [birthdays, search, filterRelation]);

  // Months name map
  const getMonthName = (dateStr: string) => {
    const [month] = dateStr.split("-");
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[Number(month) - 1] || "Unknown";
  };

  const handleAddGift = (bdayId: string) => {
    if (!newGiftText.trim()) return;
    const bday = birthdays.find((b) => b.id === bdayId);
    if (bday) {
      const updatedGifts = [...bday.giftIdeas, newGiftText.trim()];
      updateBirthday(bdayId, { giftIdeas: updatedGifts });
      setNewGiftText("");
    }
  };

  const handleRemoveGift = (bdayId: string, giftIndex: number) => {
    const bday = birthdays.find((b) => b.id === bdayId);
    if (bday) {
      const updatedGifts = bday.giftIdeas.filter((_, idx) => idx !== giftIndex);
      updateBirthday(bdayId, { giftIdeas: updatedGifts });
    }
  };

  // Quick Action: Send Wish
  const handleSendWish = (name: string) => {
    const message = encodeURIComponent(`Happy Birthday, ${name}! Hope you have a wonderful day! 🌸🎂`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  // Quick Action: Plan Something
  const handlePlanTask = (name: string) => {
    addTask({
      title: `Plan birthday celebration for ${name} 🎂`,
      dueDate: new Date().toISOString().split("T")[0],
      priority: "Important",
      tags: ["Celebration", name],
      recurrence: "none",
    });
    alert(`Added task: "Plan birthday celebration for ${name}" 🌸`);
  };

  return (
    <div className="flex flex-col gap-5 p-5 pb-24 overflow-y-auto w-full max-w-[480px] mx-auto select-none">
      {/* View Header */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold tracking-wider uppercase text-poppy-text-muted">
            Celebrate People
          </span>
          <h1 className="font-fraunces text-3xl font-extrabold text-poppy-soil dark:text-poppy-cream mt-0.5">
            Birthdays 🎂
          </h1>
        </div>
        <button
          onClick={() => onOpenQuickAdd("birthday")}
          className="w-10 h-10 rounded-full bg-poppy-blush hover:bg-poppy-blush/90 text-white flex items-center justify-center shadow-md active:scale-95 transition-all focus:outline-none"
          aria-label="Add Birthday"
        >
          <Plus size={20} weight="bold" />
        </button>
      </div>

      {/* Search & Filter controls */}
      <div className="flex gap-2 animate-[fade-in_0.3s_ease-out]">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={18}
            className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-poppy-text-muted"
          />
          <input
            type="text"
            placeholder="Search birthdays..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-poppy-petal/20 dark:border-poppy-text-muted/10 bg-white/70 dark:bg-[#1C1713]/70 text-poppy-soil dark:text-poppy-cream placeholder:text-poppy-text-muted/50 focus:outline-none focus:ring-2 focus:ring-poppy-blush/30 text-sm"
          />
        </div>
        <div className="relative">
          <select
            value={filterRelation}
            onChange={(e) => setFilterRelation(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-poppy-petal/20 dark:border-poppy-text-muted/10 bg-white/70 dark:bg-[#1C1713]/70 text-poppy-soil dark:text-poppy-cream focus:outline-none focus:ring-2 focus:ring-poppy-blush/30 text-sm font-semibold"
          >
            <option value="All">All Tags</option>
            <option value="Partner">Partner</option>
            <option value="Family">Family</option>
            <option value="Friend">Friend</option>
            <option value="Colleague">Colleague</option>
            <option value="Other">Other</option>
          </select>
          <Funnel size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-poppy-text-muted" />
        </div>
      </div>

      {/* Birthdays List */}
      {processedBirthdays.length === 0 ? (
        <div className="text-center py-12 bg-poppy-mist/30 dark:bg-poppy-mist/5 rounded-[20px] border border-dashed border-poppy-petal/30 p-6">
          <p className="text-poppy-text-muted italic text-sm">
            {search || filterRelation !== "All"
              ? "No birthdays match your filter."
              : "No birthdays added yet. Keep your loved ones close."}
          </p>
          <button
            onClick={() => onOpenQuickAdd("birthday")}
            className="mt-3 text-xs font-bold text-poppy-blush bg-poppy-petal/20 px-4 py-2 rounded-full hover:bg-poppy-petal/30 active:scale-95 transition-all"
          >
            Add First Birthday
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {processedBirthdays.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-[#1C1713] rounded-[20px] p-5 shadow-sm border border-poppy-petal/10 flex flex-col gap-4 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-sm font-fraunces text-lg"
                  style={{ backgroundColor: b.avatarColor }}
                >
                  {b.name.charAt(0)}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-poppy-soil dark:text-poppy-cream text-base leading-tight">
                      {b.name}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-poppy-petal/20 dark:bg-poppy-petal/10 text-poppy-blush font-bold uppercase tracking-wider">
                      {b.relationship}
                    </span>
                  </div>
                  <p className="text-xs text-poppy-text-muted">
                    {getMonthName(b.date)} {b.date.split("-")[1]} • Remind {b.reminderLeadTime === 0 ? "on the day" : `${b.reminderLeadTime} days prior`}
                  </p>
                  <p className="text-xs font-semibold text-poppy-blush mt-1 font-fraunces">
                    {b.daysRemaining === 0
                      ? "Happy Birthday! Today 🎂"
                      : b.daysRemaining === 1
                      ? "Tomorrow! 🎂"
                      : `${b.name}'s birthday in ${b.daysRemaining} days 🌸`}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => deleteBirthday(b.id)}
                  className="p-2 text-poppy-text-muted hover:text-poppy-blush rounded-full hover:bg-poppy-mist dark:hover:bg-poppy-mist/10 transition-colors"
                  aria-label="Delete birthday"
                >
                  <Trash size={18} />
                </button>
              </div>

              {/* Quick action buttons */}
              <div className="grid grid-cols-3 gap-2 border-t border-poppy-mist dark:border-[#251E19] pt-3">
                <button
                  onClick={() => handleSendWish(b.name)}
                  className="py-2 px-1 rounded-xl bg-poppy-mist/30 dark:bg-poppy-mist/5 border border-poppy-petal/5 text-poppy-soil dark:text-poppy-cream text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-poppy-petal/10 hover:text-poppy-blush transition-colors"
                >
                  <WhatsappLogo size={16} className="text-[#25D366]" />
                  Wish
                </button>
                <button
                  onClick={() => handlePlanTask(b.name)}
                  className="py-2 px-1 rounded-xl bg-poppy-mist/30 dark:bg-poppy-mist/5 border border-poppy-petal/5 text-poppy-soil dark:text-poppy-cream text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-poppy-petal/10 hover:text-poppy-blush transition-colors"
                >
                  <CalendarPlus size={16} className="text-poppy-stem" />
                  Plan
                </button>
                <button
                  onClick={() => setActiveGiftIndex(activeGiftIndex === b.id ? null : b.id)}
                  className={`py-2 px-1 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    activeGiftIndex === b.id
                      ? "bg-poppy-petal/30 border-poppy-petal text-poppy-blush"
                      : "bg-poppy-mist/30 dark:bg-poppy-mist/5 border-poppy-petal/5 text-poppy-soil dark:text-poppy-cream hover:bg-poppy-petal/10"
                  }`}
                >
                  <Gift size={16} className="text-poppy-amber" />
                  Gifts
                </button>
              </div>

              {/* Gift Drawer */}
              {activeGiftIndex === b.id && (
                <div className="border-t border-[#F5EFE8] dark:border-[#251E19] pt-3 space-y-2 animate-[fade-in_0.2s_ease-out]">
                  <span className="text-[10px] uppercase font-bold text-poppy-text-muted tracking-wider block">
                    Gift Ideas
                  </span>
                  {b.giftIdeas.length === 0 ? (
                    <p className="text-xs text-poppy-text-muted italic">No gift ideas added yet.</p>
                  ) : (
                    <ul className="space-y-1">
                      {b.giftIdeas.map((gift, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between text-xs text-poppy-soil dark:text-poppy-cream bg-poppy-mist/20 dark:bg-[#251E19]/40 py-1.5 px-3 rounded-lg border border-poppy-petal/5"
                        >
                          <span>🌸 {gift}</span>
                          <button
                            onClick={() => handleRemoveGift(b.id, idx)}
                            className="text-poppy-text-muted hover:text-poppy-blush p-0.5"
                          >
                            <Trash size={12} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Add Gift Form */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add gift idea..."
                      value={newGiftText}
                      onChange={(e) => setNewGiftText(e.target.value)}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-poppy-petal/20 bg-poppy-cream dark:bg-[#14110E] text-poppy-soil dark:text-poppy-cream placeholder:text-poppy-text-muted/40 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddGift(b.id);
                      }}
                    />
                    <button
                      onClick={() => handleAddGift(b.id)}
                      className="px-3 py-1.5 bg-poppy-amber text-white text-xs font-semibold rounded-lg hover:bg-poppy-amber/90 active:scale-95 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
