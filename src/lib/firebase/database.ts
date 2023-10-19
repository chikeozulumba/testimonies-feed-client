import { getDatabase, onValue, ref, set } from "firebase/database";
import mitt from "mitt";
import { FirebaseApp } from ".";

const emitter = mitt();
export const FirebaseDB = getDatabase(FirebaseApp);

export async function writeToFirebaseDB(key: string, payload: any) {
  await set(ref(FirebaseDB, key), payload);
}

export async function readFromFirebaseDB(key: string) {
  const starCountRef = ref(FirebaseDB, key);
  onValue(starCountRef, (snapshot) => {
    emitter.emit("data", snapshot.val());
  });
}
