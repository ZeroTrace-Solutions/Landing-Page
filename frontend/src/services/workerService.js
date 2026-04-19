import { db } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc,
  onSnapshot,
  runTransaction
} from "firebase/firestore";

export const addWorker = async (name, avatar) => {
  const workerData = {
    name,
    avatar, // Config for boring-avatars
    status: 'clockout',
    workStatus: [], // Head is current status
    workTimes: [],  // Head is current timestamp
    notebook: '',
    notebookFontFamily: 'ZTMS, serif',
    notebookFontSize: '14px',
    timerBgStyle: 'cosmic',
    checklist: [],
    totalHours: 0,
    history: {}, // Map by month: { '2026-03': [logs] }
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, "workers"), workerData);
  return docRef.id;
};

export const subscribeToWorkers = (callback) => {
  return onSnapshot(collection(db, "workers"), (snapshot) => {
    const workers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(workers);
  });
};

export const subscribeToWorker = (workerId, callback) => {
  const docRef = doc(db, "workers", workerId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    }
  });
};

export const updateWorkerStatus = async (workerId, status, timestamp, label = null) => {
  const workerRef = doc(db, "workers", workerId);
  await runTransaction(db, async (tx) => {
    const workerSnap = await tx.get(workerRef);
    if (!workerSnap.exists()) throw new Error("Worker not found");

    const current = workerSnap.data();
    const currentStatus = Array.isArray(current.workStatus) ? current.workStatus : [];
    const currentTimes = Array.isArray(current.workTimes) ? current.workTimes : [];
    const currentLabels = Array.isArray(current.workLabels) ? current.workLabels : [];

    await tx.update(workerRef, {
      status,
      workStatus: [...currentStatus, status],
      workTimes: [...currentTimes, timestamp],
      workLabels: [...currentLabels, label || '']
    });
  });
};

export const syncWorkerField = async (workerId, field, data) => {
  const workerRef = doc(db, "workers", workerId);
  await updateDoc(workerRef, {
    [field]: data
  });
};

export const clearWorkerLogs = async (workerId) => {
  const workerRef = doc(db, "workers", workerId);
  await updateDoc(workerRef, {
    workStatus: [],
    workTimes: [],
    workLabels: [],
    status: 'clockout',
  });
};

export const archiveMonthlyLogs = async (workerId, month, logs, totalClockinHours) => {
  const workerRef = doc(db, "workers", workerId);
  await updateDoc(workerRef, {
    [`history.${month}`]: {
      logs,
      totalHours: totalClockinHours
    },
    totalHours: totalClockinHours, // Add to cumulative
    workStatus: [],
    workTimes: [],
    status: 'clockout'
  });
};

export const calculateWorkerMonthlyStats = (workStatus, workTimes) => {
  let totalWorkMs = 0;
  let lastIn = null;

  for (let i = 0; i < workStatus.length; i++) {
    const status = workStatus[i];
    const time = new Date(workTimes[i]).getTime();

    if (status === 'clockin') {
      lastIn = time;
    } else if (status === 'break' || status === 'clockout') {
      if (lastIn) {
        totalWorkMs += (time - lastIn);
        lastIn = null;
      }
    }
  }

  // If still clocked in, count up to now
  if (workStatus[workStatus.length - 1] === 'clockin' && lastIn) {
    totalWorkMs += (Date.now() - lastIn);
  }

  return totalWorkMs;
};

// Work Categories Management
export const subscribeToWorkCategories = (callback) => {
  return onSnapshot(collection(db, "workCategories"), (snapshot) => {
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(categories);
  });
};

export const addWorkCategory = async (name) => {
  const docRef = await addDoc(collection(db, "workCategories"), {
    name,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};
