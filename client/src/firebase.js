import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_API_KEY,
  authDomain: import.meta.env.REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.REACT_APP_PROJECT_ID,
  storageBucket: import.meta.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.REACT_APP_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

try {
  const storageTest = getStorage(firebaseApp);
  console.log("successfully deployed firebaseApp");
  console.log(storageTest);
} catch (e) {
  console.error(`Firebase storage isn't initialized! ${e}`);
}

export const storage = getStorage(firebaseApp);
