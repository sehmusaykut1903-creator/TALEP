import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDw4fhe9HaPWI809pllmvGIDE22c5WsA",
  authDomain: "talep-1aa0f.firebaseapp.com",
  projectId: "talep-1aa0f",
  storageBucket: "talep-1aa0f.firebasestorage.app",
  messagingSenderId: "554079661226",
  appId: "1:554079661226:web:3fad281c73559a4d5874d3",
};

const app = initializeApp(firebaseConfig);

// Enable robust, multi-tab persistent IndexedDB local cache
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export const auth = getAuth(app);

