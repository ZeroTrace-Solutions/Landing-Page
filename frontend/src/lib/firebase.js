import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isConfigured = Boolean(
  rawApiKey &&
  typeof rawApiKey === "string" &&
  rawApiKey.trim() !== "" &&
  !rawApiKey.includes("undefined")
);

const firebaseConfig = {
  // If env variables are not set locally, use valid formatted placeholder to prevent synchronous crash
  apiKey: isConfigured ? rawApiKey : "AIzaSyDummyKeyForLocalDevOnly_000000000",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zerotrace-local.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zerotrace-local",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zerotrace-local.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000"
};

let app;
let db;
let auth;

try {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.warn("[Firebase] Offline fallback mode engaged:", error?.message || error);
  // Fallback app initialization with valid mock string if needed
  try {
    app = initializeApp({ apiKey: "AIzaSyFallbackKeyForDevelopment_000", projectId: "fallback-proj" }, "fallback");
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (innerError) {
    console.error("[Firebase] Fatal init failure:", innerError);
  }
}

export { db, auth, isConfigured };
export default app;
