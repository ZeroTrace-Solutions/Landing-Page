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
  orderBy,
  getDoc,
  onSnapshot,
  where,
  deleteField
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

// ----------------------------------------------------
// Live Docs API
// ----------------------------------------------------

export const hashPassword = async (plainText) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const getLiveDocs = async (projectId) => {
  const q = query(
    collection(db, "liveDocs"),
    where("projectId", "==", projectId)
  );
  const querySnapshot = await getDocs(q);
  // Sort on client side since orderBy requires compound index
  const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createLiveDoc = async (projectId, name, password, projectMeta) => {
  const passwordHash = await hashPassword(password);
  const docData = {
    projectId,
    name,
    projectName: projectMeta?.name || 'ZeroTrace',
    projectLogo: projectMeta?.logo || null,
    passwordHash,
    createdAt: new Date().toISOString(),
    finalized: false,
    closed: false,
    participants: {}
  };
  const docRef = await addDoc(collection(db, "liveDocs"), docData);
  // Create an initial empty block so listeners have something
  await setDoc(doc(db, "liveDocs", docRef.id, "blocks", "content"), {
    html: "",
    updatedAt: new Date().toISOString(),
    updatedBy: "System"
  });
  return docRef.id;
};

export const deleteLiveDoc = async (docId) => {
  await deleteDoc(doc(db, "liveDocs", docId));
};

export const closeDoc = async (docId) => {
  const docRef = doc(db, "liveDocs", docId);
  await updateDoc(docRef, { closed: true });
};

export const getLiveDocMeta = async (docId) => {
  const docRef = doc(db, "liveDocs", docId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const subscribeToDocMeta = (docId, callback) => {
  const docRef = doc(db, "liveDocs", docId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });
};

export const subscribeToDocContent = (docId, callback) => {
  const q = query(collection(db, "liveDocs", docId, "blocks"));
  return onSnapshot(q, (snapshot) => {
    const blocks = {};
    snapshot.forEach(doc => {
      blocks[doc.id] = { id: doc.id, ...doc.data() };
    });
    // Generally there is only one block 'content' based on our new unified TiPTap approach
    callback(blocks['content']);
  });
};

export const saveDocContent = async (docId, html, updatedBy) => {
  const docRef = doc(db, "liveDocs", docId, "blocks", "content");
  await setDoc(docRef, {
    html: html || "",
    updatedBy: updatedBy || "Anonymous",
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export const subscribeToComments = (docId, callback) => {
  const q = query(collection(db, "liveDocs", docId, "comments"));
  return onSnapshot(q, (snapshot) => {
    const comments = [];
    snapshot.forEach(doc => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    // Sort ascending by creation time
    comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    callback(comments);
  });
};

export const addComment = async (docId, data) => {
  const commentsRef = collection(db, "liveDocs", docId, "comments");
  await addDoc(commentsRef, {
    ...data,
    resolved: false,
    createdAt: new Date().toISOString()
  });
};

export const resolveComment = async (docId, commentId) => {
  const commentRef = doc(db, "liveDocs", docId, "comments", commentId);
  await updateDoc(commentRef, { resolved: true, aiDraft: null });
};

export const proposeAiSolution = async (docId, commentId, proposedText, originalText) => {
  const commentRef = doc(db, "liveDocs", docId, "comments", commentId);
  await updateDoc(commentRef, { 
    aiDraft: { proposedText, originalText, proposedAt: new Date().toISOString() } 
  });
};

export const clearAiDraft = async (docId, commentId) => {
  const commentRef = doc(db, "liveDocs", docId, "comments", commentId);
  await updateDoc(commentRef, { aiDraft: null });
};

export const updateComment = async (docId, commentId, text) => {
  const commentRef = doc(db, "liveDocs", docId, "comments", commentId);
  await updateDoc(commentRef, { text, updatedAt: new Date().toISOString() });
};

export const deleteComment = async (docId, commentId) => {
  const commentRef = doc(db, "liveDocs", docId, "comments", commentId);
  await deleteDoc(commentRef);
};

export const saveParticipant = async (docId, key, info) => {
  const docRef = doc(db, "liveDocs", docId);
  // Store the participant info as a nested field under 'participants' map
  await updateDoc(docRef, {
    [`participants.${key}`]: info
  });
};

export const kickParticipant = async (docId, key) => {
  const docRef = doc(db, "liveDocs", docId);
  await updateDoc(docRef, {
    [`participants.${key}.kickedAt`]: new Date().toISOString()
  });
};

export const markDocPendingFinalization = async (docId, requestedBy) => {
  const docRef = doc(db, "liveDocs", docId);
  await updateDoc(docRef, {
    pendingFinalization: true,
    pendingFinalizationRequestedBy: requestedBy,
    pendingFinalizationRequestedAt: new Date().toISOString(),
    pendingFinalizeNotification: true,
    finalized: false
  });
};

export const clearPendingFinalizeNotification = async (docId) => {
  const docRef = doc(db, "liveDocs", docId);
  await updateDoc(docRef, {
    pendingFinalizeNotification: false
  });
};

export const finalizeDoc = async (docId, signatureDataUrl, signerName) => {
  const docRef = doc(db, "liveDocs", docId);
  await updateDoc(docRef, {
    finalized: true,
    pendingFinalization: false,
    signature: signatureDataUrl,
    signerName: signerName,
    finalizedAt: new Date().toISOString()
  });
};
