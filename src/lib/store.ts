import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  rollNumber: string;
  attendance: {
    subject: string;
    classesMissed: number;
  }[];
}

interface DataStore {
  updateUserAttendance: (
    rollNumber: string,
    subject: string,
    attendance: number
  ) => void;
  lastRollNumber: string;
  setLastRollNumber: (rollNumber: string) => void;
  users: User[];
  addUser: (user: User) => void;
  removeUser: (rollNumber: string) => void;
  getUser: (rollNumber: string) => User | undefined;
}

export const useDataStore = create(
  persist<DataStore>(
    (set, get) => ({
      lastRollNumber: "",
      setLastRollNumber: (rollNumber: string) =>
        set({ lastRollNumber: rollNumber }),
      users: [],
      addUser: (user: User) => set({ users: [...get().users, user] }),
      removeUser: (rollNumber: string) => {
        const users = get().users.filter(
          (user) => user.rollNumber !== rollNumber
        );
        set({ users });
      },
      updateUserAttendance: (
        rollNumber: string,
        subject: string,
        classesMissed: number
      ) => {
        const users = get().users;
        const user = users.find((user) => user.rollNumber === rollNumber);
        if (!user) {
          console.error("User not found");
          return;
        }

        let updated = false;

        for (let subjectAttendance of user.attendance) {
          if (subjectAttendance.subject === subject) {
            subjectAttendance.classesMissed = classesMissed;
            updated = true;
            break;
          }
        }
        if (!updated) {
          user.attendance.push({ subject, classesMissed });
        }

        set({ users });
      },
      getUser: (rollNumber: string) =>
        get().users.find((user) => user.rollNumber === rollNumber),
    }),
    {
      name: "data-storage",
    }
  )
);
