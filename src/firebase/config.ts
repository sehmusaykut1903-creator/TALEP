import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

let app: any = null;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.error("Firebase initializeApp failed:", e);
}

// Guarantee app is never undefined/null
if (!app) {
  app = {
    name: "[DEFAULT]",
    options: firebaseConfig
  };
}

let db: any = null;
try {
  // Pass the Database ID securely to initialize the correct database
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} catch (errInner) {
  console.error("Fallback getFirestore failed:", errInner);
}

// Guarantee Firestore DB is never undefined/null to prevent crash and preserve render flow
if (!db) {
  console.warn("Firebase DB couldn't be initialized. Falling back to an in-memory/mock DB Proxy.");
  db = new Proxy({}, {
    get(target, prop) {
      console.warn(`Attempted to access Firestore DB property "${String(prop)}" on a mock/fallback instance.`);
      return () => ({});
    }
  });
}

let auth: any = null;
try {
  auth = getAuth(app);
} catch (e) {
  console.error("Firebase getAuth failed:", e);
}

// Guarantee Auth is never undefined/null to prevent crash and preserve render flow
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
