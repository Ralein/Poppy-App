"use client";

import React, { useState, useMemo } from "react";
import { usePoppyStore, Task, Birthday, Reminder } from "@/store/poppyStore";
import { CaretLeft, CaretRight, Cake, Calendar as CalendarIcon, Bell, Sparkle } from "@phosphor-icons/react";

export default function CalendarView() {
  const { tasks, birthdays, reminders } = usePoppyStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11

  // Format month and year label
  const monthLabel = useMemo(() => {
    return currentDate.toLocaleString("default", { month: "long", year: "numeric" });
  }, [currentDate]);

  // Days in month
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Day of week (0-6)
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate(); // Days count

    const days: (Date | null)[] = [];

    // Pad previous month days as null
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    // Actual month days
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(currentYear, currentMonth, d));
    }

    return days;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Find events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const monthDayStr = dateStr.substring(5); // "MM-DD"

    const dayBirthdays = birthdays.filter((b) => b.date === monthDayStr);
    const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
    const dayReminders = reminders.filter((r) => r.date === dateStr);

    return {
      birthdays: dayBirthdays,
      tasks: dayTasks,
      reminders: dayReminders,
      count: dayBirthdays.length + dayTasks.length + dayReminders.length,
    };
  };

  // Selected Day Events detail
  const selectedDayEvents = useMemo(() => {
    return getEventsForDate(selectedDate);
  }, [selectedDate, tasks, birthdays, reminders]);

  return (
    <div className="flex flex-col gap-5 p-5 pb-24 overflow-y-auto w-full max-w-[480px] mx-auto select-none">
      {/* View Header */}
      <div className="mt-4">
        <span className="text-sm font-semibold tracking-wider uppercase text-poppy-text-muted">
          Your Timeline
        </span>
        <h1 className="font-fraunces text-3xl font-extrabold text-poppy-soil dark:text-poppy-cream mt-0.5">
          Calendar 📅
        </h1>
      </div>

      {/* Calendar Controller */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1C1713] p-4 rounded-[20px] shadow-sm border border-poppy-petal/5 animate-[fade-in_0.3s_ease-out]">
        <button
          onClick={handlePrevMonth}
          className="p-2 text-poppy-text-muted hover:text-poppy-soil rounded-full hover:bg-poppy-mist dark:hover:bg-poppy-mist/10"
        >
          <CaretLeft size={20} weight="bold" />
        </button>
        <span className="font-fraunces text-lg font-bold text-poppy-soil dark:text-poppy-cream">
          {monthLabel}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-2 text-poppy-text-muted hover:text-poppy-soil rounded-full hover:bg-poppy-mist dark:hover:bg-poppy-mist/10"
        >
          <CaretRight size={20} weight="bold" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-[#1C1713] p-4 rounded-[20px] shadow-sm border border-poppy-petal/5 space-y-4">
        {/* Days labels */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <span key={d} className="text-xs font-bold text-poppy-text-muted uppercase tracking-wider">
              {d}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const events = getEventsForDate(day);
            const activeToday = isToday(day);
            const activeSelected = isSelected(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-between p-1.5 transition-all text-xs font-semibold focus:outline-none relative ${
                  activeSelected
                    ? "bg-poppy-blush text-white shadow-md shadow-poppy-blush/20 scale-105"
                    : activeToday
                    ? "bg-poppy-petal/30 dark:bg-poppy-petal/15 text-poppy-blush border border-poppy-blush/30"
                    : "text-poppy-soil dark:text-poppy-cream hover:bg-poppy-mist/50 dark:hover:bg-poppy-mist/5"
                }`}
              >
                <span>{day.getDate()}</span>

                {/* Event indicators */}
                <div className="flex gap-0.5 justify-center w-full min-h-[6px]">
                  {events.birthdays.map((b) => (
                    <span
                      key={b.id}
                      className={`w-1 h-1 rounded-full ${activeSelected ? "bg-white" : "bg-poppy-blush"}`}
                    />
                  ))}
                  {events.tasks.map((t) => (
                    <span
                      key={t.id}
                      className={`w-1 h-1 rounded-full ${activeSelected ? "bg-white" : "bg-poppy-stem"}`}
                    />
                  ))}
                  {events.reminders.map((r) => (
                    <span
                      key={r.id}
                      className={`w-1 h-1 rounded-full ${activeSelected ? "bg-white" : "bg-poppy-amber"}`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Drawer */}
      <div className="bg-poppy-mist/40 dark:bg-poppy-mist/5 rounded-[20px] p-5 border border-poppy-petal/10 space-y-4">
        <h3 className="font-fraunces text-lg font-bold text-poppy-soil dark:text-poppy-cream px-1">
          Agenda: {selectedDate.toLocaleDateString("default", { month: "long", day: "numeric" })}
        </h3>

        {selectedDayEvents.count === 0 ? (
          <p className="text-sm text-poppy-text-muted italic text-center py-4">
            Nothing scheduled on this day. Breathe easy 🌿
          </p>
        ) : (
          <div className="space-y-3">
            {/* Day Birthdays */}
            {selectedDayEvents.birthdays.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 bg-white dark:bg-[#1C1713] p-3 rounded-xl border border-poppy-blush/20"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm font-fraunces text-sm"
                  style={{ backgroundColor: b.avatarColor }}
                >
                  {b.name.charAt(0)}
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-sm font-bold text-poppy-soil dark:text-poppy-cream">
                    🎂 {b.name}&apos;s Birthday!
                  </span>
                  <span className="text-[10px] text-poppy-blush font-bold uppercase tracking-wider">
                    {b.relationship}
                  </span>
                </div>
              </div>
            ))}

            {/* Day Tasks */}
            {selectedDayEvents.tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 bg-white dark:bg-[#1C1713] p-3 rounded-xl border border-poppy-stem/20"
              >
                <div className="p-1 text-poppy-stem">
                  <CalendarIcon size={20} />
                </div>
                <div className="flex-1 flex flex-col">
                  <span
                    className={`text-sm font-semibold ${
                      t.completed ? "line-through text-poppy-text-muted" : "text-poppy-soil dark:text-poppy-cream"
                    }`}
                  >
                    {t.title}
                  </span>
                  <span className="text-[10px] text-poppy-text-muted flex items-center gap-1.5">
                    Priority: <span className="font-bold">{t.priority}</span>
                  </span>
                </div>
              </div>
            ))}

            {/* Day Reminders */}
            {selectedDayEvents.reminders.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 bg-white dark:bg-[#1C1713] p-3 rounded-xl border border-poppy-amber/20"
              >
                <div className="p-1 text-poppy-amber">
                  <Bell size={20} />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-sm font-semibold text-poppy-soil dark:text-poppy-cream">
                    🔔 {r.title}
                  </span>
                  {r.time && (
                    <span className="text-[10px] text-poppy-text-muted font-mono">
                      At {r.time}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
