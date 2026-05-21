import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  initializeFirestore, 
  getFirestore,
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

let app: any;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.error("Firebase initializeApp failed:", e);
}

let db: any;
try {
  if (app) {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  }
} catch (e) {
  console.warn("Firebase initializeFirestore with persistent multi-tab cache failed, falling back to basic/in-memory Firestore:", e);
  try {
    if (app) {
      db = getFirestore(app);
    }
  } catch (errInner) {
    console.error("Fallback getFirestore failed:", errInner);
  }
}

// If db is still not initialized, we can define a proxy or mock object to avoid crashes
if (!db) {
  console.warn("Firebase DB couldn't be initialized. Falling back to an in-memory/mock DB Proxy.");
  db = new Proxy({}, {
    get(target, prop) {
      console.warn(`Attempted to access Firestore DB property "${String(prop)}" on a mock/fallback instance.`);
      return () => ({});
    }
  });
}

let auth: any;
try {
  if (app) {
    auth = getAuth(app);
  }
} catch (e) {
  console.error("Firebase getAuth failed:", e);
}

if (!auth) {
  console.warn("Firebase Auth couldn't be initialized. Falling back to an empty mock auth proxy.");
  auth = new Proxy({}, {
    get(target, prop) {
      console.warn(`Attempted to access Auth property "${String(prop)}" on a mock/fallback instance.`);
      if (prop === 'onAuthStateChanged') {
        return (cb: any) => {
          // Trigger callback with null user safely
          if (typeof cb === 'function') {
            setTimeout(() => cb(null), 10);
          }
          return () => {};
        };
      }
      return () => {};
    }
  });
}

export { app, db, auth };


