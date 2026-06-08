"use client";

import React, { useState, useMemo } from "react";
import { usePoppyStore, Task } from "@/store/poppyStore";
import { Circle, CheckCircle, Plus, Trash, Tag, CaretDown, CaretUp } from "@phosphor-icons/react";
import PetalBurst from "./PetalBurst";

interface TasksViewProps {
  onOpenQuickAdd: (tab: "birthday" | "task" | "reminder") => void;
}

export default function TasksView({ onOpenQuickAdd }: TasksViewProps) {
  const { tasks, toggleTask, deleteTask, addSubtask, toggleSubtask } = usePoppyStore();

  // Filters
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  // Subtask form state
  const [activeSubtaskTaskId, setActiveSubtaskTaskId] = useState<string | null>(null);
  const [subtaskTitle, setSubtaskTitle] = useState("");

  // Collapsed states for groups
  const [collapsedGroups, setCollapsedGroups] = useState({
    today: false,
    upcoming: false,
    someday: false,
    completed: true, // Completed items collapsed by default
  });

  // Petal burst state
  const [burstTaskId, setBurstTaskId] = useState<string | null>(null);

  const toggleGroup = (group: keyof typeof collapsedGroups) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleCheckboxClick = (taskId: string, currentCompleted: boolean) => {
    if (!currentCompleted) {
      // Trigger burst animation
      setBurstTaskId(taskId);
    }
    toggleTask(taskId);
  };

  // Group tasks
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, search, priorityFilter]);

  const groups = useMemo(() => {
    const today: Task[] = [];
    const upcoming: Task[] = [];
    const someday: Task[] = [];
    const completed: Task[] = [];

    filteredTasks.forEach((t) => {
      if (t.completed) {
        completed.push(t);
      } else if (t.dueDate === todayStr) {
        today.push(t);
      } else if (t.dueDate > todayStr) {
        upcoming.push(t);
      } else {
        someday.push(t);
      }
    });

    return { today, upcoming, someday, completed };
  }, [filteredTasks, todayStr]);

  const handleAddSubtask = (taskId: string) => {
    if (!subtaskTitle.trim()) return;
    addSubtask(taskId, subtaskTitle.trim());
    setSubtaskTitle("");
  };

  const priorityBadge = (p: Task["priority"]) => {
    if (p === "Urgent") return "text-poppy-blush bg-poppy-blush/10 border-poppy-blush/20";
    if (p === "Important") return "text-poppy-amber bg-poppy-amber/10 border-poppy-amber/20";
    return "text-poppy-stem bg-poppy-stem/10 border-poppy-stem/20";
  };

  return (
    <div className="flex flex-col gap-5 p-5 pb-24 overflow-y-auto w-full max-w-[480px] mx-auto select-none">
      {/* View Header */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold tracking-wider uppercase text-poppy-text-muted">
            Stay Centered
          </span>
          <h1 className="font-fraunces text-3xl font-extrabold text-poppy-soil dark:text-poppy-cream mt-0.5">
            Tasks ✅
          </h1>
        </div>
        <button
          onClick={() => onOpenQuickAdd("task")}
          className="w-10 h-10 rounded-full bg-poppy-blush hover:bg-poppy-blush/90 text-white flex items-center justify-center shadow-md active:scale-95 transition-all focus:outline-none"
          aria-label="Add Task"
        >
          <Plus size={20} weight="bold" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 animate-[fade-in_0.3s_ease-out]">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-poppy-petal/20 dark:border-poppy-text-muted/10 bg-white/70 dark:bg-[#1C1713]/70 text-poppy-soil dark:text-poppy-cream placeholder:text-poppy-text-muted/50 focus:outline-none focus:ring-2 focus:ring-poppy-blush/30 text-sm"
        />

        {/* Priority Filter Pills */}
        <div className="flex gap-2">
          {["All", "Gentle", "Important", "Urgent"].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold border transition-all text-center ${
                priorityFilter === p
                  ? "bg-poppy-soil dark:bg-poppy-cream text-white dark:text-poppy-soil border-poppy-soil dark:border-poppy-cream shadow-sm"
                  : "bg-white dark:bg-[#1C1713] border-poppy-petal/20 dark:border-poppy-text-muted/10 text-poppy-text-muted hover:text-poppy-soil"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Task Groups List */}
      <div className="space-y-4">
        {/* GROUP: TODAY */}
        <div className="bg-white/40 dark:bg-[#1C1713]/20 rounded-[20px] border border-poppy-petal/5 overflow-hidden">
          <button
            onClick={() => toggleGroup("today")}
            className="w-full px-4 py-3 bg-poppy-mist/40 dark:bg-poppy-mist/5 flex items-center justify-between font-fraunces text-base font-bold text-poppy-soil dark:text-poppy-cream"
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-poppy-stem" />
              Today ({groups.today.length})
            </span>
            {collapsedGroups.today ? <CaretDown size={16} /> : <CaretUp size={16} />}
          </button>
          {!collapsedGroups.today && (
            <div className="p-4 space-y-3">
              {groups.today.length === 0 ? (
                <p className="text-xs text-poppy-text-muted italic text-center py-2">
                  No tasks due today. Breathe easy 🌿
                </p>
              ) : (
                groups.today.map((task) => renderTaskRow(task))
              )}
            </div>
          )}
        </div>

        {/* GROUP: UPCOMING */}
        <div className="bg-white/40 dark:bg-[#1C1713]/20 rounded-[20px] border border-poppy-petal/5 overflow-hidden">
          <button
            onClick={() => toggleGroup("upcoming")}
            className="w-full px-4 py-3 bg-poppy-mist/40 dark:bg-poppy-mist/5 flex items-center justify-between font-fraunces text-base font-bold text-poppy-soil dark:text-poppy-cream"
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-poppy-sky" />
              Upcoming ({groups.upcoming.length})
            </span>
            {collapsedGroups.upcoming ? <CaretDown size={16} /> : <CaretUp size={16} />}
          </button>
          {!collapsedGroups.upcoming && (
            <div className="p-4 space-y-3">
              {groups.upcoming.length === 0 ? (
                <p className="text-xs text-poppy-text-muted italic text-center py-2">No upcoming tasks.</p>
              ) : (
                groups.upcoming.map((task) => renderTaskRow(task))
              )}
            </div>
          )}
        </div>

        {/* GROUP: SOMEDAY */}
        <div className="bg-white/40 dark:bg-[#1C1713]/20 rounded-[20px] border border-poppy-petal/5 overflow-hidden">
          <button
            onClick={() => toggleGroup("someday")}
            className="w-full px-4 py-3 bg-poppy-mist/40 dark:bg-poppy-mist/5 flex items-center justify-between font-fraunces text-base font-bold text-poppy-soil dark:text-poppy-cream"
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-poppy-text-muted" />
              Someday / Overdue ({groups.someday.length})
            </span>
            {collapsedGroups.someday ? <CaretDown size={16} /> : <CaretUp size={16} />}
          </button>
          {!collapsedGroups.someday && (
            <div className="p-4 space-y-3">
              {groups.someday.length === 0 ? (
                <p className="text-xs text-poppy-text-muted italic text-center py-2">No someday or overdue tasks.</p>
              ) : (
                groups.someday.map((task) => renderTaskRow(task))
              )}
            </div>
          )}
        </div>

        {/* GROUP: COMPLETED */}
        <div className="bg-white/40 dark:bg-[#1C1713]/20 rounded-[20px] border border-poppy-petal/5 overflow-hidden">
          <button
            onClick={() => toggleGroup("completed")}
            className="w-full px-4 py-3 bg-poppy-mist/40 dark:bg-poppy-mist/5 flex items-center justify-between font-fraunces text-base font-bold text-poppy-soil dark:text-poppy-cream"
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-poppy-petal" />
              Completed ({groups.completed.length})
            </span>
            {collapsedGroups.completed ? <CaretDown size={16} /> : <CaretUp size={16} />}
          </button>
          {!collapsedGroups.completed && (
            <div className="p-4 space-y-3">
              {groups.completed.length === 0 ? (
                <p className="text-xs text-poppy-text-muted italic text-center py-2">No completed tasks yet.</p>
              ) : (
                groups.completed.map((task) => renderTaskRow(task))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function renderTaskRow(task: Task) {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length;

    return (
      <div
        key={task.id}
        className={`bg-white dark:bg-[#1C1713] rounded-2xl p-4 shadow-sm border border-poppy-petal/5 transition-all flex flex-col gap-3 relative`}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox wrapper with PetalBurst trigger */}
          <div className="relative flex items-center justify-center min-w-[32px] min-h-[32px]">
            <button
              onClick={() => handleCheckboxClick(task.id, task.completed)}
              className="text-poppy-blush hover:scale-105 active:scale-95 transition-all p-1"
            >
              {task.completed ? (
                <CheckCircle size={22} weight="fill" className="text-poppy-stem" />
              ) : (
                <Circle size={22} className="text-poppy-blush" />
              )}
            </button>
            <PetalBurst active={burstTaskId === task.id} onComplete={() => setBurstTaskId(null)} />
          </div>

          {/* Task Info */}
          <div className="flex-1 space-y-1">
            <div className="flex flex-col gap-0.5">
              <span
                className={`text-sm font-semibold leading-snug cursor-pointer ${
                  task.completed ? "line-through text-poppy-text-muted font-normal" : "text-poppy-soil dark:text-poppy-cream"
                }`}
                onClick={() => handleCheckboxClick(task.id, task.completed)}
              >
                {task.title}
              </span>

              {/* Tag badges */}
              {task.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <Tag size={12} className="text-poppy-text-muted" />
                  {task.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-semibold text-poppy-text-muted/80">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom details */}
            <div className="flex items-center gap-3 pt-1">
              {/* Due date */}
              <span className="text-[10px] text-poppy-text-muted font-medium bg-poppy-mist/40 dark:bg-[#251E19]/40 py-0.5 px-2 rounded-md font-mono">
                📅 {task.dueDate} {task.dueTime && `at ${task.dueTime}`}
              </span>

              {/* Priority badge */}
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityBadge(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>

              {/* Recurrence Indicator */}
              {task.recurrence !== "none" && (
                <span className="text-[9px] font-bold uppercase text-poppy-stem tracking-wide bg-poppy-leaf/10 py-0.5 px-2 rounded-full">
                  🔁 {task.recurrence}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Delete button */}
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 text-poppy-text-muted hover:text-poppy-blush hover:bg-poppy-mist dark:hover:bg-poppy-mist/10 rounded-full transition-colors"
            >
              <Trash size={16} />
            </button>
            {/* Toggle subtasks drawer button */}
            <button
              onClick={() => setActiveSubtaskTaskId(activeSubtaskTaskId === task.id ? null : task.id)}
              className="text-[10px] font-bold text-poppy-stem bg-poppy-leaf/15 hover:bg-poppy-leaf/25 px-2 py-1 rounded-lg transition-all"
            >
              Subtasks ({completedSubtasksCount}/{task.subtasks.length})
            </button>
          </div>
        </div>

        {/* Subtask Drawer Drawer */}
        {activeSubtaskTaskId === task.id && (
          <div className="border-t border-[#F5EFE8] dark:border-[#251E19] pt-3 pl-8 space-y-2.5 animate-[fade-in_0.2s_ease-out]">
            <span className="text-[10px] uppercase font-bold text-poppy-text-muted tracking-wider block">
              Subtasks Check
            </span>
            {task.subtasks.length === 0 ? (
              <p className="text-xs text-poppy-text-muted italic">No subtasks yet. Break it down 🌸</p>
            ) : (
              <div className="space-y-1.5">
                {task.subtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2.5 py-0.5">
                    <button
                      onClick={() => toggleSubtask(task.id, sub.id)}
                      className="text-poppy-blush hover:scale-110 active:scale-90 transition-transform p-0.5"
                    >
                      {sub.completed ? (
                        <CheckCircle size={18} weight="fill" className="text-poppy-stem" />
                      ) : (
                        <Circle size={18} className="text-poppy-petal" />
                      )}
                    </button>
                    <span
                      className={`text-xs ${
                        sub.completed ? "line-through text-poppy-text-muted" : "text-poppy-soil dark:text-poppy-cream font-medium"
                      }`}
                    >
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* Add Subtask Input */}
            <div className="flex gap-2 pt-1.5">
              <input
                type="text"
                placeholder="New subtask..."
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-poppy-petal/20 bg-poppy-cream dark:bg-[#14110E] text-poppy-soil dark:text-poppy-cream focus:outline-none placeholder:text-poppy-text-muted/40"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddSubtask(task.id);
                }}
              />
              <button
                onClick={() => handleAddSubtask(task.id)}
                className="px-3 py-1.5 bg-poppy-stem text-white text-xs font-bold rounded-lg hover:bg-poppy-stem/90 active:scale-95 transition-all"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
