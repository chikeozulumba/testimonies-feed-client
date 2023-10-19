import { Timestamp, doc, getFirestore, setDoc } from "firebase/firestore";
import mitt from "mitt";
import { FirebaseApp } from ".";

const emitter = mitt();
export const FirestoreDB = getFirestore(FirebaseApp);

export async function writeToFirestoreDB(
  field: string,
  payload: any,
  ...args: any[]
) {
  if (Array.isArray(payload)) {
    payload.map((p) => ({ ...p, createdAt: Timestamp.fromDate(new Date()) }));
  } else {
    payload = {
      ...payload,
      createdAt: Timestamp.fromDate(new Date()),
    };
  }
  await setDoc(doc(FirestoreDB, field, ...args), payload);
}

export async function readFromFirebaseDB(key: string) {}
