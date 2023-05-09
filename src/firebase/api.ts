import {
  CollectionReference,
  collection,
  DocumentData,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  updateDoc,
  where,
  limit,
  startAfter,
  Timestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import { Entry, NewEntry } from "../types";
import { db } from "./config";

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

export const entryCollection = createCollection<Entry>("entries");

export const getAll = async (uid: string | undefined) => {
  const querySnapshot = await getDocs(
    query(entryCollection, where("userId", "==", uid))
  );
  const dataArr: Entry[] = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return dataArr;
};

export const getPaginatedEntries = async (
  entriesList: Entry[],
  count: number,
  last: QueryDocumentSnapshot | null,
  uid: string
) => {
  if (last === null && uid) {
    const first = query(
      entryCollection,
      where("userId", "==", uid),
      orderBy("date", "desc"),
      limit(count)
    );
    const documentSnapshots = await getDocs(first);

    const data = documentSnapshots.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const lastVisible =
      data.length === count
        ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
        : undefined;

    return { data, lastVisible };
  } else if (uid) {
    const next = query(
      entryCollection,
      where("userId", "==", uid),
      orderBy("date", "desc"),
      startAfter(last),
      limit(count)
    );
    const documentSnapshots = await getDocs(next);
    const data = entriesList.concat(
      documentSnapshots.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
    const lastVisible =
      entriesList.length - data.length === count
        ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
        : undefined;
    return { data, lastVisible };
  }
};

export const getEntry = async (id: string): Promise<Entry | undefined> => {
  const docRef = doc(db, "entries", id);
  try {
    const docSnap: DocumentData = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id };
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteEntry = async (id: string): Promise<void> => {
  const entryDoc = doc(db, "entries", id);
  try {
    await deleteDoc(entryDoc);
  } catch (error) {
    console.log(error);
  }
};

export const updateEntry = async (
  id: string,
  revisedEntry: Entry
): Promise<void> => {
  const entryDoc = doc(db, "entries", id);
  try {
    await updateDoc(entryDoc, { ...revisedEntry });
  } catch (error) {
    console.log(error);
  }
};

export const addEntry = async (newEntry: NewEntry): Promise<void> => {
  try {
    await addDoc(entryCollection, newEntry);
  } catch (error) {
    console.log(error);
  }
};

export const entriesQuery = async (
  startDate: string,
  endDate: string,
  uid: string
) => {
  let q;
  if (startDate !== "" && endDate !== "" && uid) {
    q = query(
      entryCollection,
      where("userId", "==", uid),
      where("date", ">=", Timestamp.fromDate(new Date(`${startDate} EDT`))),
      where("date", "<=", Timestamp.fromDate(new Date(`${endDate}T23:59:59`)))
    );
  } else if (startDate !== "" && uid) {
    q = query(
      entryCollection,
      where("userId", "==", uid),
      where("date", ">=", Timestamp.fromDate(new Date(`${startDate} EDT`)))
    );
  } else if (endDate !== "" && uid) {
    q = query(
      entryCollection,
      where("userId", "==", uid),
      where("date", "<=", Timestamp.fromDate(new Date(`${endDate}T23:59:59`)))
    );
  } else {
    return;
  }
  const querySnapshot = await getDocs(q);
  const entryList = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return entryList;
};
