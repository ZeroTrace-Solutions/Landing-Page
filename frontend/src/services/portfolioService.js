import { db } from "../lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  orderBy
} from "firebase/firestore";

// Portfolio Data
export const getPortfolioData = async () => {
  const querySnapshot = await getDocs(collection(db, "portfolio"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updatePortfolioItem = async (id, data) => {
  const docRef = doc(db, "portfolio", id);
  await updateDoc(docRef, data);
};

export const addPortfolioItem = async (data) => {
  await addDoc(collection(db, "portfolio"), data);
};

export const deletePortfolioItem = async (id) => {
  const docRef = doc(db, "portfolio", id);
  await deleteDoc(docRef);
};

// Whitepaper Data
export const getWhitepaperData = async () => {
  const q = query(collection(db, "whitepaper"), orderBy("id", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
};

export const updateWhitepaperItem = async (id, data) => {
  const docRef = doc(db, "whitepaper", id);
  await updateDoc(docRef, data);
};

export const addWhitepaperItem = async (data) => {
  await addDoc(collection(db, "whitepaper"), data);
};

export const deleteWhitepaperItem = async (id) => {
  const docRef = doc(db, "whitepaper", id);
  await deleteDoc(docRef);
};

// Projects Data
export const getProjectsData = async () => {
  const querySnapshot = await getDocs(collection(db, "projects"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateProject = async (id, data) => {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, data);
};

export const addProject = async (data) => {
  await addDoc(collection(db, "projects"), data);
};

export const deleteProject = async (id) => {
  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
};

// Initial Migration Helper (to be called manually or during initial setup)
export const migrateData = async (portfolio, whitepaper) => {
  // Migrate Portfolio
  for (const item of portfolio) {
    const slug = (item.title || "item").toLowerCase().replace(/\s+/g, '-');
    await setDoc(doc(db, "portfolio", slug), item);
  }
  
  // Migrate Whitepaper
  for (const item of whitepaper) {
    const slug = (item.id || item.title || "paper").toLowerCase().replace(/\s+/g, '-');
    await setDoc(doc(db, "whitepaper", slug), item);
  }

  // Create Default Project
  await setDoc(doc(db, "projects", "ZeroTrace"), {
    name: "ZeroTrace",
    credentials: [
      { key: "API_URL", value: "https://api.zerotrace.solutions" },
      { key: "STATUS", value: "ACTIVE" }
    ],
    lastUpdated: new Date().toLocaleString()
  });
};
