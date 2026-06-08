import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Birthday {
  id: string;
  name: string;
  date: string; // "YYYY-MM-DD" or "MM-DD"
  relationship: "Family" | "Friend" | "Colleague" | "Partner" | "Other";
  reminderLeadTime: number; // in days
  giftIdeas: string[];
  avatarColor: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string; // "YYYY-MM-DD"
  dueTime?: string; // "HH:MM"
  priority: "Gentle" | "Important" | "Urgent";
  tags: string[];
  completed: boolean;
  subtasks: Subtask[];
  recurrence: "daily" | "weekly" | "monthly" | "none";
}

export interface Reminder {
  id: string;
  title: string;
  date?: string; // "YYYY-MM-DD"
  time?: string; // "HH:MM"
  location?: string;
  recurring: boolean;
  completed: boolean;
}

interface PoppyState {
  birthdays: Birthday[];
  tasks: Task[];
  reminders: Reminder[];
  streak: number;
  lastActiveDate: string | null; // For checking streak
  theme: "light" | "dark";

  // Actions
  addBirthday: (birthday: Omit<Birthday, "id">) => void;
  updateBirthday: (id: string, updates: Partial<Birthday>) => void;
  deleteBirthday: (id: string) => void;

  addTask: (task: Omit<Task, "id" | "completed" | "subtasks">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  addReminder: (reminder: Omit<Reminder, "id" | "completed">) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;

  toggleTheme: () => void;
  updateStreak: () => void;
}

// Predefined soft colors for avatar backgrounds
export const AVATAR_COLORS = [
  "#FF6B8A", // Blush
  "#FFB3C1", // Petal
  "#4A7C59", // Stem
  "#A8C5A0", // Leaf
  "#F4A261", // Amber
  "#A8DADC", // Sky
  "#DDA15E", // Sand
  "#CDDAF6", // Periwinkle
];

export const usePoppyStore = create<PoppyState>()(
  persist(
    (set, get) => ({
      birthdays: [
        {
          id: "1",
          name: "Maya Lin",
          date: "06-12", // June 12th
          relationship: "Friend",
          reminderLeadTime: 3,
          giftIdeas: ["Ceramic vase", "Botanical illustrations book"],
          avatarColor: "#FF6B8A",
        },
        {
          id: "2",
          name: "Uncle Arthur",
          date: "06-25", // June 25th
          relationship: "Family",
          reminderLeadTime: 7,
          giftIdeas: ["Gardening tools", "Warm wool socks"],
          avatarColor: "#4A7C59",
        },
        {
          id: "3",
          name: "Sophie Dupont",
          date: "07-01", // July 1st
          relationship: "Partner",
          reminderLeadTime: 0,
          giftIdeas: ["Handmade scrapbook", "Surprise picnic in the park"],
          avatarColor: "#FFB3C1",
        },
      ],
      tasks: [
        {
          id: "101",
          title: "Buy seeds for the balcony planter 🌸",
          dueDate: new Date().toISOString().split("T")[0],
          priority: "Gentle",
          tags: ["Home", "Gardening"],
          completed: false,
          subtasks: [
            { id: "101-1", title: "Find heirloom poppy seeds", completed: false },
            { id: "101-2", title: "Pick up organic soil", completed: false },
          ],
          recurrence: "none",
        },
        {
          id: "102",
          title: "Design birthday card for Maya 🎂",
          dueDate: new Date().toISOString().split("T")[0],
          priority: "Important",
          tags: ["Creative", "Maya"],
          completed: false,
          subtasks: [],
          recurrence: "none",
        },
        {
          id: "103",
          title: "Confirm dentist appointment tomorrow morning",
          dueDate: new Date().toISOString().split("T")[0],
          priority: "Urgent",
          tags: ["Health"],
          completed: true,
          subtasks: [],
          recurrence: "none",
        },
      ],
      reminders: [
        {
          id: "201",
          title: "Water the indoor ferns 🌿",
          time: "09:00",
          recurring: true,
          completed: false,
        },
        {
          id: "202",
          title: "Pick up flowers for the table 💐",
          location: "Near the flower shop",
          recurring: false,
          completed: false,
        },
      ],
      streak: 3,
      lastActiveDate: new Date().toISOString().split("T")[0],
      theme: "light",

      // Birthdays Actions
      addBirthday: (b) =>
        set((state) => ({
          birthdays: [
            ...state.birthdays,
            {
              ...b,
              id: Math.random().toString(36).substring(2, 9),
            },
          ],
        })),

      updateBirthday: (id, updates) =>
        set((state) => ({
          birthdays: state.birthdays.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      deleteBirthday: (id) =>
        set((state) => ({
          birthdays: state.birthdays.filter((b) => b.id !== id),
        })),

      // Tasks Actions
      addTask: (t) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...t,
              id: Math.random().toString(36).substring(2, 9),
              completed: false,
              subtasks: [],
            },
          ],
        })),

      toggleTask: (id) => {
        set((state) => {
          const updatedTasks = state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          );
          return { tasks: updatedTasks };
        });
        get().updateStreak();
      },

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      addSubtask: (taskId, title) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: [
                    ...t.subtasks,
                    {
                      id: Math.random().toString(36).substring(2, 9),
                      title,
                      completed: false,
                    },
                  ],
                }
              : t
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? { ...s, completed: !s.completed } : s
                  ),
                }
              : t
          ),
        })),

      // Reminders Actions
      addReminder: (r) =>
        set((state) => ({
          reminders: [
            ...state.reminders,
            {
              ...r,
              id: Math.random().toString(36).substring(2, 9),
              completed: false,
            },
          ],
        })),

      toggleReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, completed: !r.completed } : r
          ),
        }));
        get().updateStreak();
      },

      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),

      // Theme Action
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === "light" ? "dark" : "light";
          if (typeof window !== "undefined") {
            const root = window.document.documentElement;
            if (nextTheme === "dark") {
              root.classList.add("dark");
            } else {
              root.classList.remove("dark");
            }
          }
          return { theme: nextTheme };
        }),

      // Streak Action
      updateStreak: () => {
        const state = get();
        const todayStr = new Date().toISOString().split("T")[0];

        // Check if there are no open tasks/reminders that are due today
        const hasOpenTodayTasks = state.tasks.some(
          (t) => t.dueDate === todayStr && !t.completed
        );

        if (!hasOpenTodayTasks) {
          // If all tasks for today are completed, let's increment the streak
          if (state.lastActiveDate !== todayStr) {
            set((state) => ({
              streak: state.streak + 1,
              lastActiveDate: todayStr,
            }));
          }
        }
      },
    }),
    {
      name: "poppy-local-store",
    }
  )
);

