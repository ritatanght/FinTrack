import { Timestamp } from "firebase/firestore";

export type EntryDate = Timestamp;

export interface Entry {
  id: string;
  amount: number;
  date: EntryDate;
  category: string;
  expense: boolean;
  description: string;
  userId: string;
}

export type NewEntry = Omit<Entry, "id">;

export interface WorkingEntries {
  amount: number;
  year: number;
  month: number;
  category: string;
  expense: boolean;
}
