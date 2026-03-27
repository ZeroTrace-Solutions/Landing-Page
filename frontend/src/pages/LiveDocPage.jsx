import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from 'tiptap-extension-font-size';
import SignatureCanvas from 'react-signature-canvas';
import {
  Printer, ShieldAlert, AlertTriangle, Users, MessageSquare,
  X, Check, RotateCcw, UserX, Loader2, Globe, Sun, Moon, Lock as LockIcon,
  MessageCircle, Send, Menu, MoreHorizontal, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  getLiveDocMeta, subscribeToDocMeta, subscribeToDocContent, saveDocContent,
  subscribeToComments, addComment, resolveComment, updateComment, deleteComment,
  saveParticipant, kickParticipant, finalizeDoc, markDocPendingFinalization, clearPendingFinalizeNotification, hashPassword,
  proposeAiSolution, clearAiDraft
} from '../services/dataService';

import { auth } from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';

// Refactored Components
import DocToolbar from '../components/livedocs/DocToolbar';
import CommentsSidebar from '../components/livedocs/CommentsSidebar';
import FinalizeDocDialog from '../components/livedocs/FinalizeDocDialog';
import DocHeader from '../components/livedocs/DocHeader';
import DocStamps from '../components/livedocs/DocStamps';
import CommentAddPopover from '../components/livedocs/CommentAddPopover';
import LiveDocGates from '../components/livedocs/LiveDocGates';
import AiWriterPanel from '../components/livedocs/AiWriterPanel';
import LiveDocPrintView from '../components/livedocs/LiveDocPrintView';
import DocContextMenu from '../components/livedocs/DocContextMenu';
import ConfirmActionDialog from '../components/livedocs/ConfirmActionDialog';

const getAdditionalStyles = (theme) => `
  *::selection {
    background: #2563eb !important;
    color: white !important;
  }
  .ProseMirror {
    outline: none !important;
    padding: 40px 20px !important;
    min-height: 800px;
    font-size: 16px;
    line-height: 1.6;
    text-align: inherit;
    background: ${theme === 'dark' ? '#09090b' : '#fff'};
    box-shadow: 0 4px 30px rgba(0,0,0,${theme === 'dark' ? '0.8' : '0.1'});
    color: ${theme === 'dark' ? '#e4e4e7' : '#18181b'} !important;
  }
  @media (min-width: 640px) {
    .ProseMirror {
      padding: 60px 80px !important;
    }
  }
  .ProseMirror p, .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
    direction: ltr;
    color: inherit !important;
  }
  .ProseMirror [style*="text-align: right"] {
    direction: rtl !important;
  }
  .ProseMirror [style*="text-align: left"], .ProseMirror [style*="text-align: center"] {
    direction: ltr !important;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    color: ${theme === 'dark' ? '#52525b' : '#a1a1aa'};
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  /* Premium Content Styles - Differentiated Headings */
  .ProseMirror h1 { font-size: 1.8em; font-weight: 900; margin: 12px 0 24px; color: ${theme === 'dark' ? '#fff' : '#000'} !important; border-bottom: 3px solid #3b82f6; padding-bottom: 0.15em; line-height: 1.1; letter-spacing: -0.02em; }
  .ProseMirror h2 { font-size: 1.5em; font-weight: 800; margin: 24px 0 16px; color: #3b82f6 !important; letter-spacing: -0.01em; }
  
  @media (min-width: 640px) {
    .ProseMirror h1 { font-size: 2.8em; }
    .ProseMirror h2 { font-size: 2.1em; }
  }

  .ProseMirror h3 { font-size: 1.5em; font-weight: 700; margin: 16px 0 8px; color: ${theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'} !important; }
  .ProseMirror h4 { font-size: 1.25em; font-weight: 700; margin: 12px 0 6px; color: #3b82f6 !important; text-transform: uppercase; letter-spacing: 0.05em; }
  .ProseMirror hr { border: none; border-top: 2px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}; margin: 2em 0; }
  .ProseMirror blockquote { border-left: 4px solid #3b82f6; padding: 16px 24px; font-style: italic; background: ${theme === 'dark' ? 'rgba(59, 130, 246, 0.05)' : '#f8fafc'}; margin: 1.5em 0; border-radius: 0 12px 12px 0; }
  .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin: 1em 0; }
  .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin: 1em 0; }
  .ProseMirror li { margin-bottom: 0.5em; }
  .ProseMirror strong { font-weight: 900; color: ${theme === 'dark' ? '#fff' : '#000'}; }
  
  .ProseMirror table { border-collapse: collapse; width: 100%; margin: 2em 0; border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; }
  .ProseMirror td, .ProseMirror th { border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; padding: 12px; text-align: left; }
  .ProseMirror th { background: ${theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#f1f5f9'}; font-weight: 900; }

  [style*="text-align: right"] p.is-editor-empty:first-child::before {
    float: right;
  }
  @media print {
    body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
    .no-print, .screen-view { display: none !important; }
    
    .print-view { display: block !important; }

    @page { 
      margin: 10mm !important;
      size: auto;
    }
  }
`;

export const LiveDocPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [theme, setTheme] = useState('dark');
  const [passwordState, setPasswordState] = useState('pending');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameState, setNameState] = useState('pending');
  const [nameInput, setNameInput] = useState('');

  const [docMeta, setDocMeta] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [participants, setParticipants] = useState({});
  const [kicked, setKicked] = useState(false);
  const [comments, setComments] = useState([]);

  const [commentsPanelOpen, setCommentsPanelOpen] = useState(false);
  const [commentPopover, setCommentPopover] = useState({ show: false, x: 0, y: 0, from: 0, to: 0, lineText: '' });
  const [draftCommentText, setDraftCommentText] = useState('');
  const [focusedComment, setFocusedComment] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [preFocusContent, setPreFocusContent] = useState(null);

  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [pendingSignatureOpen, setPendingSignatureOpen] = useState(false);
  const signatureRef = useRef(null);
  const isFirstLoadRef = useRef(true);
  const isFirstCommentsLoadRef = useRef(true);
  const prevCommentsRef = useRef([]);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [resolvingCommentId, setResolvingCommentId] = useState(null);
  const [aiReview, setAiReview] = useState(null);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [deleteCommentState, setDeleteCommentState] = useState({ isOpen: false, id: null, isBusy: false });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    
    // Ensure anonymous auth for guest access to Firestore
    if (!auth.currentUser) {
      signInAnonymously(auth).catch(err => console.error("Anonymous auth failed:", err));
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Unified Notification Helper
  const sendRefinedNotification = useCallback((title, message, type = 'info') => {
    // 1. Always show toast (will be visible when user is/returns to foreground)
    if (type === 'success') toast.success(message);
    else if (type === 'error') toast.error(message);
    else toast.info(message);

    // 2. Show system notification if backgrounded (for immediate alert)
    if (document.visibilityState !== 'visible' && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, { body: message, icon: '/favicon.ico' });
      } catch (e) { }
    }
  }, []);

  const FontSizeShortcuts = Extension.create({
    name: 'fontSizeShortcuts',
    addKeyboardShortcuts() {
      return {
        'Mod-]': () => {
          const sizeStr = this.editor.getAttributes('textStyle').fontSize || '16px';
          const currentSize = parseInt(sizeStr);
          return this.editor.commands.setFontSize(`${currentSize + 2}px`);
        },
        'Mod-[': () => {
          const sizeStr = this.editor.getAttributes('textStyle').fontSize || '16px';
          const currentSize = parseInt(sizeStr);
          return this.editor.commands.setFontSize(`${Math.max(8, currentSize - 2)}px`);
        },
        'Mod-Shift-X': () => this.editor.commands.toggleStrike(),
        'Mod-Shift-x': () => this.editor.commands.toggleStrike(),
      }
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      FontSizeShortcuts,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    editorProps: {
      attributes: {
        dir: i18n.dir(),
      },
    },
    content: '',
    editable: false,
  });

  const docMetaRef = useRef(docMeta);
  const kickedRef = useRef(kicked);
  const currentUserRef = useRef(currentUser);
  const Signature = SignatureCanvas.default || SignatureCanvas;

  useEffect(() => { docMetaRef.current = docMeta; }, [docMeta]);
  useEffect(() => { kickedRef.current = kicked; }, [kicked]);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  const timeoutRef = useRef(null);
  const saveHTMLDebounced = useCallback((html, updatedBy) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSyncStatus('unsaved');
    timeoutRef.current = setTimeout(async () => {
      setSyncStatus('saving');
      try {
        await saveDocContent(id, html, updatedBy);
        setSyncStatus('synced');
      } catch (err) {
        console.error("Save failed:", err);
        setSyncStatus('unsaved');
      }
    }, 1000);
  }, [id]);

  useEffect(() => {
    if (!editor) return;
    const handleUpdate = ({ editor }) => {
      setSyncStatus('unsaved');
      const html = editor.getHTML();
      if (focusedComment) {
        setSyncStatus('unsaved');
        return;
      }
      if (currentUserRef.current && !docMetaRef.current?.finalized && !docMetaRef.current?.closed && !kickedRef.current) {
        saveHTMLDebounced(html, currentUserRef.current.name);
      }
    };
    editor.on('update', handleUpdate);
    return () => editor.off('update', handleUpdate);
  }, [editor, saveHTMLDebounced, focusedComment]);

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = getAdditionalStyles(theme);
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, [theme]);

  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: { attributes: { dir: i18n.dir() } },
      });
    }
  }, [i18n.language, editor]);

  const checkPassword = async (e) => {
    e?.preventDefault();
    if (!passwordInput.trim()) return;
    setPasswordState('checking');
    try {
      const meta = await getLiveDocMeta(id);
      if (!meta) {
        toast.error(t('liveDocs.documentNotFound'));
        navigate('/');
        return;
      }
      const inputHash = await hashPassword(passwordInput);
      if (inputHash === meta.passwordHash) {
        setPasswordState('authenticated');
        setDocMeta(meta);
        const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;
        const storedName = localStorage.getItem(`zt_doc_user_${id}`);
        if (storedName && storedName !== adminPass) {
          joinSession(storedName, false, meta);
        } else {
          setNameState('pending');
        }
      } else {
        setPasswordState('error');
        setTimeout(() => setPasswordState('pending'), 800);
      }
    } catch (err) {
      console.error("Verification error details:", err);
      toast.error(t('liveDocs.verificationFailed'));
      setPasswordState('pending');
    }
  };

  const submitName = async (e) => {
    e?.preventDefault();
    if (!nameInput.trim()) return;
    setNameState('checking');
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;
    let nameToUse = nameInput.trim();
    let isAdmin = false;

    if (nameToUse === adminPass) {
      nameToUse = 'ZeroTrace';
      isAdmin = true;
    } else {
      nameToUse = nameToUse.toUpperCase();
      localStorage.setItem(`zt_doc_user_${id}`, nameToUse);
    }
    joinSession(nameToUse, isAdmin, docMeta);
  };

  const joinSession = async (name, isAdmin, meta) => {
    if (meta?.closed) {
      navigate(`/docs/${id}/preview`);
      return;
    }
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    const userKey = btoa(encodeURI(name)).replace(/[=+\/]/g, "");
    const user = { name, isAdmin, key: userKey };
    setCurrentUser(user);
    await saveParticipant(id, userKey, {
      name, isAdmin, device: navigator.userAgent, joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    });
    setNameState('authenticated');
  };

  useEffect(() => {
    if (nameState !== 'authenticated' || !currentUser) return;
    const unsubMeta = subscribeToDocMeta(id, (meta) => {
      if (!meta) { navigate('/'); return; }
      setDocMeta(meta);
      setParticipants(meta.participants || {});
      if (meta.participants?.[currentUser.key]?.kickedAt) {
        setKicked(true);
        if (editor) editor.setEditable(false);
      }
      if (meta.closed) navigate(`/docs/${id}/preview`);
      if (meta.finalized && editor) editor.setEditable(false);
    });

    const unsubContent = subscribeToDocContent(id, (contentBlock) => {
      if (contentBlock && editor) {
        const isSelfUpdate = contentBlock.updatedBy === currentUserRef.current?.name;
        if (isFirstLoadRef.current || !isSelfUpdate) {
          const currentHTML = editor.getHTML();
          if (currentHTML !== contentBlock.html) {
            const { from, to } = editor.state.selection;
            editor.commands.setContent(contentBlock.html, false);
            if (!isFirstLoadRef.current) editor.commands.setTextSelection({ from, to });
          }
          
          // Guest is notified ONLY if doc edited by admin and guest is backgrounded
          if (!isFirstLoadRef.current && !isSelfUpdate && contentBlock.updatedBy === 'ZeroTrace' && !currentUserRef.current?.isAdmin) {
            if (document.visibilityState !== 'visible') {
              sendRefinedNotification(t('ZeroTrace Live Docs'), t('liveDocs.madeEdits'));
            }
          }
        }
        isFirstLoadRef.current = false;
      }
    });

    const unsubComments = subscribeToComments(id, (fetchedComments) => {
      if (isFirstCommentsLoadRef.current) {
        prevCommentsRef.current = fetchedComments;
        isFirstCommentsLoadRef.current = false;
        const activeComments = fetchedComments.filter(c => !c.resolved);
        setComments(activeComments);
        return;
      }

      const prevComments = prevCommentsRef.current;
      fetchedComments.forEach(comment => {
        const prev = prevComments.find(p => p.id === comment.id);
        
        // Admin is notified when a guest adds a comment
        if (!prev && currentUserRef.current?.isAdmin && comment.authorName !== 'ZeroTrace') {
          sendRefinedNotification(t('ZeroTrace Live Docs'), `New comment from ${comment.authorName}`);
        }

        // ONLY the guest who added the comment is notified when its resolved
        if (prev && !prev.resolved && comment.resolved && currentUserRef.current?.key === comment.authorKey) {
          sendRefinedNotification(t('ZeroTrace Live Docs'), t('liveDocs.resolveComment') || 'Comment resolved');
        }
      });

      prevCommentsRef.current = fetchedComments;
      const activeComments = fetchedComments.filter(c => !c.resolved);
      setComments(activeComments);
    });

    // Heartbeat Interval for real-time presence (every 45s)
    const heartbeatInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && currentUserRef.current) {
        saveParticipant(id, currentUserRef.current.key, {
          name: currentUserRef.current.name,
          isAdmin: currentUserRef.current.isAdmin,
          device: navigator.userAgent,
          lastActiveAt: new Date().toISOString()
        }).catch(() => { /* Silent failure for heartbeat */ });
      }
    }, 45000);

    return () => { unsubMeta(); unsubContent(); unsubComments(); clearInterval(heartbeatInterval); };
  }, [nameState, currentUser, id, editor, navigate, t, sendRefinedNotification]);

  useEffect(() => {
    if (!editor) return;

    if (docMeta?.closed || docMeta?.finalized || docMeta?.pendingFinalization) {
      editor.setEditable(false);
      return;
    }

    if (nameState === 'authenticated' && !kicked) {
      editor.setEditable(currentUser?.isAdmin || false);
    }
  }, [editor, nameState, kicked, docMeta, currentUser]);

  useEffect(() => {
    if (!docMeta || !currentUser) return;

    const guestPending = docMeta.pendingFinalization && !docMeta.finalized && !currentUser.isAdmin;
    
    // Auto-open signature window if online (real-time transition)
    setPendingSignatureOpen(guestPending);

    if (guestPending && docMeta.pendingFinalizeNotification) {
      if (document.visibilityState !== 'visible' || isFirstLoadRef.current) {
        sendRefinedNotification(
          t('ZeroTrace Live Docs'), 
          t('liveDocs.pendingFinalizeNotification') || 'Document finalization is pending; please complete signature.'
        );
      }

      clearPendingFinalizeNotification(id).catch((err) => {
        console.error('Failed to clear pending finalize notification:', err);
      });
    }
  }, [docMeta, currentUser, id, t, sendRefinedNotification]);

  const handleKick = async (partKey) => {
    if (!currentUser?.isAdmin) return;
    try {
      await kickParticipant(id, partKey);
      toast.success(t('liveDocs.kickSuccess'));
    } catch (err) {
      toast.error(t('liveDocs.kickError'));
    }
  };

  const focusCommentInEditor = useCallback((comment) => {
    if (!editor || !comment || !comment.lineText) return;
    setCommentsPanelOpen(false);

    const targetText = comment.lineText.trim();
    if (!targetText) return;

    let from = -1;
    let to = -1;
    let blockFrom = -1;
    let blockTo = -1;

    editor.state.doc.descendants((node, pos) => {
      if (!node.isText || from !== -1) return true;
      const idx = node.text.indexOf(targetText);
      if (idx !== -1) {
        from = pos + idx;
        to = from + targetText.length;

        const $pos = editor.state.doc.resolve(from);
        blockFrom = $pos.start();
        blockTo = $pos.end();

        return false;
      }
      return true;
    });

    if (from === -1 || to === -1) return;

    const selFrom = blockFrom !== -1 ? blockFrom : from;
    const selTo = blockTo !== -1 ? blockTo : to;

    editor.commands.focus();
    editor.commands.setTextSelection({ from: selFrom, to: selTo });
    editor.commands.scrollIntoView();

    // Ensure the block is visible in the editor container (especially if it's outside current viewport)
    const domPos = editor.view.domAtPos(selFrom).node;
    let paragraphEl = domPos.nodeType === Node.TEXT_NODE ? domPos.parentElement : domPos;
    if (paragraphEl && paragraphEl.closest) {
      paragraphEl = paragraphEl.closest('p, h1, h2, h3, h4, h5, h6, blockquote, li, td, th, pre, div');
    }

    if (!paragraphEl) return;

    // If the paragraph is not fully visible inside editor scroll frame, scroll smoothly.
    paragraphEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    // Highlight paragraph in place so the highlight scrolls with content.
    const previousOutline = paragraphEl.style.outline;
    const previousBackground = paragraphEl.style.backgroundColor;
    const previousTransition = paragraphEl.style.transition;

    paragraphEl.style.outline = '3px solid rgba(59, 130, 246, 0.8)';
    paragraphEl.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    paragraphEl.style.transition = 'background-color 0.2s ease, outline 0.2s ease';

    setTimeout(() => {
      paragraphEl.style.backgroundColor = previousBackground;
      paragraphEl.style.outline = previousOutline;
      paragraphEl.style.transition = previousTransition;
    }, 1200);
  }, [editor]);

  const enterFocusMode = (comment) => {
    if (!currentUser?.isAdmin) return;
    setPreFocusContent(editor.getHTML());
    setFocusedComment(comment);
    setTimeout(() => focusCommentInEditor(comment), 100);
    setCommentsPanelOpen(false);
  };

  const handleContextMenu = (e) => {
    if (!editor) return;
    const { selection } = editor.state;
    if (selection.empty) return;

    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleContextMenuCopy = async () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, ' ');
    if (text) {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          toast.success(t('liveDocs.copied') || 'Copied to clipboard');
        } else {
          // Fallback legacy copy
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          textArea.style.top = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const success = document.execCommand('copy');
          document.body.removeChild(textArea);
          if (success) toast.success(t('liveDocs.copied') || 'Copied to clipboard');
          else throw new Error('EXEC_COMMAND_FAILED');
        }
      } catch (err) {
        console.error('Failed to copy text:', err);
        toast.error('COPY_FAILED');
      }
    }
  };

  const handleAiResolve = async (comment) => {
    if (!currentUser?.isAdmin || !window.puter) return;
    setResolvingCommentId(comment.id);

    const fullHtml = editor.getHTML();
    const targetText = comment.lineText;
    const critique = comment.text;

    try {
      setSyncStatus('saving');

      const prompt = `
        You are an expert editor at ZeroTrace.
        Entire Document Context (HTML):
        ${fullHtml}

        A user commented on this specific text: "${targetText}"
        Critique/Request: "${critique}"

        Task: Rewrite the specific text ("${targetText}") to address the critique perfectly.
        Requirements:
        1. Maintain the design, style, and formatting of the surrounding document.
        2. Return ONLY the improved replacement for the specific text.
        3. Do not add any conversational text, explanations, or quotes.
        4. If the source was a headline or a bullet, keep it as such in your output if possible.
      `;

      const response = await window.puter.ai.chat(prompt);
      const improvedVersion = response.message.content.trim().replace(/^["']|["']$/g, '');
      if (!improvedVersion) {
        throw new Error('AI returned empty resolution');
      }

      await proposeAiSolution(id, comment.id, improvedVersion, targetText);
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id
            ? { ...c, aiDraft: { proposedText: improvedVersion, originalText: targetText, proposedAt: new Date().toISOString() } }
            : c
        )
      );

      // -> In-place review overlay flow (no immediate mutation)
      let from = -1;
      let to = -1;
      editor.state.doc.descendants((node, pos) => {
        if (from !== -1 || !node.isTextblock) return true;
        const content = node.textContent;
        const index = content.indexOf(targetText);
        if (index !== -1) {
          from = pos + 1 + index;
          to = from + targetText.length;
          return false;
        }
        return true;
      });

      if (from === -1 || to === -1) {
        toast.error(t('liveDocs.textNotFound') || 'Reference text not found in source.');
        return;
      }

      editor.commands.focus();
      editor.commands.setTextSelection({ from, to });
      editor.commands.scrollIntoView();

      const startCoords = editor.view.coordsAtPos(from);
      const endCoords = editor.view.coordsAtPos(to);
      const top = Math.min(startCoords.bottom, endCoords.bottom) + 10;
      const left = (startCoords.left + endCoords.right) / 2;

      setAiReview({ comment, from, to, originalText: targetText, proposedText: improvedVersion, top, left });
      toast.success(t('liveDocs.aiDraftReady') || 'AI draft ready for review');
      return;

    } catch (err) {
      console.error(err);
      // Revert editor if we failed after modifying it locally
      if (editor && fullHtml) {
        editor.commands.setContent(fullHtml, false);
      }
      toast.error(t('liveDocs.aiError') || 'AI resolution failed.');
    } finally {
      setResolvingCommentId(null);
      setSyncStatus('synced');
    }
  };

  const handleAiAccept = async (comment) => {
    if (!currentUser?.isAdmin) return;
    try {
      await resolveComment(id, comment.id);
      toast.success(t('liveDocs.aiAccepted') || 'Changes Accepted');
    } catch (e) { }
  };

  const handleAiReject = async (commentDraft) => {
    if (!currentUser?.isAdmin || !editor) return;
    const { proposedText, originalText } = commentDraft.aiDraft;

    try {
      const currentHtml = editor.getHTML();
      let found = false;
      editor.state.doc.descendants((node, pos) => {
        if (found) return false;
        if (node.isText && node.text.includes(proposedText)) {
          const start = pos + node.text.indexOf(proposedText);
          const end = start + proposedText.length;
          editor.commands.setTextSelection({ from: start, to: end });
          editor.commands.insertContent(originalText);
          found = true;
          return false;
        }
      });

      if (!found && currentHtml.includes(proposedText)) {
        const updatedHtml = currentHtml.replace(proposedText, originalText);
        editor.commands.setContent(updatedHtml, false);
        found = true;
      }

      if (found) {
        setSyncStatus('saving');
        const finalHtml = editor.getHTML();
        await saveDocContent(id, finalHtml, currentUser.name);
        await clearAiDraft(id, commentDraft.id);
        toast.success(t('liveDocs.aiRejected') || 'Changes Reverted');
      } else {
        await clearAiDraft(id, commentDraft.id);
        toast.error(t('liveDocs.aiRevertError') || 'Proposed text not found, metadata cleared.');
      }
    } catch (e) { }
  };

  const applyAiReview = async () => {
    if (!aiReview || !currentUser?.isAdmin || !editor) return;

    editor.commands.focus();
    editor.commands.setTextSelection({ from: aiReview.from, to: aiReview.to });
    editor.commands.insertContent(aiReview.proposedText);

    try {
      setSyncStatus('saving');
      const html = editor.getHTML();
      await saveDocContent(id, html, currentUser.name);
      await resolveComment(id, aiReview.comment.id);
      setComments((prev) => prev.filter((c) => c.id !== aiReview.comment.id));
      await clearAiDraft(id, aiReview.comment.id);
      setAiReview(null);
      toast.success(t('liveDocs.aiAccepted') || 'Changes accepted');
    } catch (err) {
      console.error('AI review accept error:', err);
      toast.error(t('liveDocs.aiError') || 'AI resolution failed.');
    } finally {
      setSyncStatus('synced');
    }
  };

  const rejectAiReview = async () => {
    if (!aiReview || !currentUser?.isAdmin) return;
    try {
      await clearAiDraft(id, aiReview.comment.id);
      setAiReview(null);
      toast.success(t('liveDocs.aiRejected') || 'Changes reverted');
    } catch (err) {
      console.error('AI review reject error:', err);
      toast.error(t('liveDocs.aiError') || 'AI resolution failed.');
    }
  };

  const redoAiReview = () => {
    if (!aiReview?.comment) return;
    setAiReview(null);
    handleAiResolve(aiReview.comment);
  };

  const handleResolveFocus = async () => {
    if (!focusedComment) return;
    try {
      setSyncStatus('saving');
      const html = editor.getHTML();
      await saveDocContent(id, html, currentUser.name);
      await resolveComment(id, focusedComment.id);
      setFocusedComment(null);
      setPreFocusContent(null);
      setSyncStatus('synced');
      toast.success(t('liveDocs.resolveComment') + " ✔");
    } catch (err) {
      console.error(err);
      toast.error('Failed to resolve');
      setSyncStatus('unsaved');
    }
  };

  const cancelFocusMode = () => {
    if (preFocusContent !== null && editor) editor.commands.setContent(preFocusContent, false);
    setFocusedComment(null);
    setPreFocusContent(null);
    setSyncStatus('synced');
  };

  const handleAddComment = async () => {
    if (!draftCommentText.trim()) return;
    try {
      await addComment(id, {
        text: draftCommentText,
        lineText: commentPopover.lineText,
        authorName: currentUser.name,
        authorKey: currentUser.key
      });
      setDraftCommentText('');
      setCommentPopover(p => ({ ...p, show: false }));
      toast.success(t('liveDocs.commentAdded'));
    } catch (err) {
      console.error(err);
      toast.error('Failed to add comment');
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      await updateComment(id, commentId, editCommentText);
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (err) { }
  };

  const handleDeleteComment = (commentId) => {
    setDeleteCommentState({ isOpen: true, id: commentId, isBusy: false });
  };

  const confirmDeleteComment = async () => {
    if (!deleteCommentState.id) return;
    setDeleteCommentState(p => ({ ...p, isBusy: true }));
    try {
      await deleteComment(id, deleteCommentState.id);
      setDeleteCommentState({ isOpen: false, id: null, isBusy: false });
      toast.success(t('liveDocs.deleteSuccess') || 'Comment deleted permanently');
    } catch (err) {
      setDeleteCommentState(p => ({ ...p, isBusy: false }));
      toast.error('Failed to delete comment');
    }
  };

  const handleRequestFinalize = async () => {
    if (!currentUser?.isAdmin) return;
    try {
      setSyncStatus('saving');
      await markDocPendingFinalization(id, currentUser.name);
      toast.success(t('liveDocs.finalizePending') || 'Finalize requested. Awaiting guest signature.');
      setSyncStatus('synced');
    } catch (err) {
      console.error('Pending finalize request failed:', err);
      toast.error(t('liveDocs.finalizeRequestFailed') || 'Failed to request finalization.');
      setSyncStatus('unsaved');
    }
  };

  const handleFinalize = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error(t('liveDocs.signInsideBox'));
      return;
    }
    const dataUrl = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
    setIsFinalizing(true);
    try {
      const html = editor.getHTML();
      await finalizeDoc(id, dataUrl, currentUser.name);
      toast.success(t('liveDocs.finalizedSuccess'));
      setPendingSignatureOpen(false);
      setFinalizeOpen(false);
    } catch (err) {
      toast.error(t('liveDocs.finalizedError'));
    } finally {
      setIsFinalizing(false);
    }
  };

  // Selection & Mouse listeners
  useEffect(() => {
    if (!editor || kicked || docMeta?.finalized || docMeta?.closed || docMeta?.pendingFinalization || focusedComment) return;

    const handleSelectionUpdate = ({ editor }) => {
      if (currentUser?.isAdmin) return;
      const { from, to } = editor.state.selection;

      // If nothing selected or selection is collapsed, hide popover
      if (from === to) {
        setCommentPopover(p => ({ ...p, show: false }));
        return;
      }

      const text = editor.state.doc.textBetween(from, to, ' ');
      if (!text.trim() || text.length > 500) {
        setCommentPopover(p => ({ ...p, show: false }));
        return;
      }

      const { view } = editor;
      try {
        const startCoords = view.coordsAtPos(from);
        const endCoords = view.coordsAtPos(to);

        // Only trigger bubble if the popover isn't already in input mode for THIS selection
        setCommentPopover(prev => {
          if (prev.show && prev.from === from && prev.to === to && prev.isInputMode) return prev;
          return {
            show: true,
            x: (startCoords.left + endCoords.right) / 2,
            y: startCoords.top,
            from,
            to,
            lineText: text,
            isInputMode: false
          };
        });
      } catch (e) {
        setCommentPopover(p => ({ ...p, show: false }));
      }
    };

    const handleEditorClick = (view, pos, event) => {
      return false;
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.setOptions({ editorProps: { handleClick: handleEditorClick } });

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.setOptions({ editorProps: { handleClick: null } });
    };
  }, [editor, kicked, docMeta, focusedComment, currentUser]);

  if (passwordState !== 'authenticated' || nameState !== 'authenticated') {
    return (
      <LiveDocGates
        passwordState={passwordState} passwordInput={passwordInput} setPasswordInput={setPasswordInput} checkPassword={checkPassword}
        nameState={nameState} nameInput={nameInput} setNameInput={setNameInput} submitName={submitName}
        theme={theme} setTheme={setTheme} t={t} i18n={i18n}
      />
    );
  }

  return (
    <div className={`${theme === 'dark' ? 'selection:bg-blue-500 selection:text-white' : 'selection:bg-blue-600 selection:text-white'} transition-colors duration-500`} dir={i18n.dir()}>
      <div className={`screen-view flex flex-col h-screen ${theme === 'dark' ? 'bg-[#09090b] text-white' : 'bg-neutral-100 text-black'} print:hidden no-print`}>
        <div className={`h-[64px] sm:h-[52px] border-b ${theme === 'dark' ? 'bg-[#18181b]/80 border-white/10' : 'bg-white/80 border-black/10'} backdrop-blur-xl flex items-center justify-between px-4 no-print z-[60] w-full shrink-0 relative order-first`}>
          <div className="flex items-center gap-3 sm:gap-6 overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/20'}`}>
                <ShieldAlert className="text-blue-500" size={16} />
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none drop-shadow-sm">ZT LiveDocs</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-[8px] font-bold uppercase tracking-tighter opacity-50">
                    {syncStatus === 'synced' ? t('liveDocs.live') : (syncStatus === 'saving' ? t('liveDocs.saving') : t('liveDocs.unsaved'))}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar py-1">
               <DocToolbar editor={editor} theme={theme} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Participants */}
            {!isMobile && (
              <div className="flex -space-x-2 no-print overflow-hidden mr-2">
                {Object.values(participants).slice(0, 3).map((p, idx) => {
                  const isOnline = p.lastActiveAt && (new Date() - new Date(p.lastActiveAt)) < (90 * 1000);
                  return (
                    <div 
                      key={idx} 
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-500 scale-90 ${
                        isOnline 
                          ? 'border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-pulse' 
                          : (theme === 'dark' ? 'bg-neutral-800 border-white/10' : 'bg-neutral-200 border-black/10')
                      } ${theme === 'dark' ? 'text-white' : 'text-black'}`} 
                      title={`${p.name} ${isOnline ? '(Online)' : '(Offline)'}`}
                    >
                      {p.name.charAt(0)}
                    </div>
                  );
                })}
              </div>
            )}

            <button onClick={() => setCommentsPanelOpen(true)} className={`relative p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-600'} hover:scale-105 active:scale-95 transition-all`}>
              <MessageSquare size={18} />
              {comments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-inherit">
                  {comments.length}
                </span>
              )}
            </button>

            {/* Mobile Dropdown Trigger */}
            {isMobile ? (
              <div className="relative">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                  className={`p-2.5 rounded-xl border flex items-center gap-1 transition-all active:scale-95 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                >
                  <Menu size={20} />
                  <ChevronDown size={14} className={`transition-transform duration-300 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {mobileMenuOpen && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 z-40"
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className={`absolute top-full right-0 mt-2 w-56 rounded-2xl border shadow-2xl p-2 z-50 overflow-hidden ${theme === 'dark' ? 'bg-[#18181b] border-white/10 shadow-black' : 'bg-white border-black/10 shadow-black/10'}`}
                      >
                         <div className="flex flex-col gap-1">
                            <button onClick={() => { i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-white/70 hover:text-white' : 'hover:bg-black/5 text-black/70 hover:text-black'}`}>
                              <Globe size={16} />
                              <span className="text-[11px] font-bold uppercase tracking-wider flex-1 text-left">{i18n.language === 'en' ? 'Arabic' : 'English'}</span>
                            </button>
                            <button onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-white/70 hover:text-white' : 'hover:bg-black/5 text-black/70 hover:text-black'}`}>
                              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                              <span className="text-[11px] font-bold uppercase tracking-wider flex-1 text-left">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>
                            <button onClick={() => { window.print(); setMobileMenuOpen(false); }} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-white/70 hover:text-white' : 'hover:bg-black/5 text-black/70 hover:text-black'}`}>
                              <Printer size={16} />
                              <span className="text-[11px] font-bold uppercase tracking-wider flex-1 text-left">{t('liveDocs.print')}</span>
                            </button>

                            <div className={`h-px my-1 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`} />
                            
                            {!docMeta?.finalized && !docMeta?.pendingFinalization && currentUser?.isAdmin && (
                              <button onClick={() => { handleRequestFinalize(); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-xl bg-blue-500 text-black hover:bg-blue-400 font-bold transition-all">
                                <LockIcon size={16} />
                                <span className="text-[11px] font-black uppercase tracking-widest">{t('liveDocs.finalize')}</span>
                              </button>
                            )}
                         </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Desktop Actions */
              <div className="flex items-center gap-2">
                <div className="h-6 w-px bg-white/10 mx-2" />
                <button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')} className={`p-2 rounded-xl border ${theme === 'dark' ? 'bg-[#09090b] border-white/10 text-white hover:bg-white/5' : 'bg-white border-black/10 text-black hover:bg-black/5'} transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}>
                  <Globe size={14} /> {i18n.language === 'en' ? 'AR' : 'EN'}
                </button>
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2 rounded-xl border ${theme === 'dark' ? 'bg-[#09090b] border-white/10 text-white hover:bg-white/5' : 'bg-white border-black/10 text-black hover:bg-black/5'} transition-all`}>
                  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                </button>
                <button onClick={() => window.print()} className={`px-4 py-2 border ${theme === 'dark' ? 'border-white/20 hover:border-white/40 text-white' : 'border-black/20 hover:border-black/40 text-black'} rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group transition-all`}>
                  <Printer size={12} /> {t('liveDocs.print')}
                </button>
                {!docMeta?.finalized && !docMeta?.pendingFinalization && currentUser?.isAdmin && (
                  <button onClick={handleRequestFinalize} className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                    <LockIcon size={12} /> {t('liveDocs.finalize')}
                  </button>
                )}
                {docMeta?.pendingFinalization && currentUser?.isAdmin && (
                  <button disabled className="px-5 py-2 bg-amber-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all opacity-80">
                    <LockIcon size={12} /> {t('liveDocs.finalizePending')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div data-lenis-prevent className={`flex-1 overflow-auto custom-scrollbar ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-200'} p-0 sm:p-12 flex justify-center print:p-0 print:bg-white transition-colors duration-500`}>
          <div className={`w-full sm:max-w-[210mm] printable-doc ${theme === 'dark' ? 'bg-[#09090b] text-[#e4e4e7] border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,1)]' : 'bg-white text-black border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.1)]'} relative print:border-none print:shadow-none print:w-full print:max-w-none transition-all duration-500`}>
            <DocHeader docMeta={docMeta} theme={theme} t={t} i18n={i18n} id={id} />

            <div className="relative" onContextMenu={handleContextMenu}>
          {aiReview && (
            <div style={{ position: 'fixed', top: aiReview.top, left: aiReview.left, transform: 'translate(-50%, -100%)', zIndex: 90, pointerEvents: 'auto' }}>
              <div className="p-4 rounded-2xl bg-slate-900/95 text-white shadow-[0_15px_45px_rgba(0,0,0,0.55)] border border-slate-600/70 max-w-xs w-[350px] backdrop-blur-md ring-1 ring-white/10">
                <div className="text-[11px] uppercase tracking-wider text-slate-200 mb-2 font-bold flex items-center justify-between">
                  <span>{t('liveDocs.aiResolve')}</span>
                  <span className="text-sky-300">{t('liveDocs.focusMode')}</span>
                </div>
                <div className="text-sm leading-relaxed text-slate-100 mb-3 max-h-28 overflow-y-auto whitespace-pre-wrap break-words">
                  {aiReview.proposedText}
                </div>
                <div className="flex gap-2">
                  <button onClick={applyAiReview} aria-label={t('liveDocs.aiAccepted') || 'Accept'} className="flex-1 rounded-xl bg-gradient-to-r from-emerald-300 to-emerald-200 text-slate-900 font-semibold py-2 transition hover:from-emerald-400 hover:to-emerald-300 active:scale-[0.98] flex items-center justify-center border border-emerald-400/60 shadow-sm shadow-emerald-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                    <Check size={18} className="text-emerald-800" />
                  </button>
                  <button onClick={rejectAiReview} aria-label={t('liveDocs.aiRejected') || 'Reject'} className="flex-1 rounded-xl bg-gradient-to-r from-rose-300 to-rose-200 text-slate-900 font-semibold py-2 transition hover:from-rose-400 hover:to-rose-300 active:scale-[0.98] flex items-center justify-center border border-rose-400/60 shadow-sm shadow-rose-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
                    <X size={18} className="text-rose-800" />
                  </button>
                  <button onClick={redoAiReview} aria-label={t('liveDocs.aiResolve') || 'Redo'} className="flex-1 rounded-xl bg-gradient-to-r from-sky-300 to-sky-200 text-slate-900 font-semibold py-2 transition hover:from-sky-400 hover:to-sky-300 active:scale-[0.98] flex items-center justify-center border border-sky-400/60 shadow-sm shadow-sky-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                    <RotateCcw size={18} className="text-sky-800" />
                  </button>
                </div>
              </div>
            </div>
          )}
          {focusedComment && <div className="fixed inset-0 z-[65] bg-black/40 backdrop-blur-[2px] cursor-not-allowed" onClick={() => setFocusedComment(null)} />}
          <div className={`${focusedComment ? 'relative z-[80] ring-[6px] ring-blue-500/50 bg-[#09090b] p-4 rounded-xl shadow-[0_0_80px_rgba(59,130,246,0.3)]' : ''} transition-all duration-300`}>
                {focusedComment && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[90]">
                    <button onClick={handleResolveFocus} className="w-10 h-10 rounded-full bg-blue-500 text-black flex items-center justify-center shadow-lg hover:bg-blue-400 hover:scale-110 transition-all"><Check size={18} /></button>
                    <button onClick={cancelFocusMode} className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 border border-red-500/50 flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white hover:scale-110 transition-all"><X size={18} /></button>
                  </div>
                )}
                <EditorContent editor={editor} />
              </div>
            </div>

            <DocStamps docMeta={docMeta} id={id} theme={theme} t={t} i18n={i18n} />
          </div>
        </div>

        <CommentAddPopover
          show={commentPopover.show && !commentsPanelOpen}
          popoverData={commentPopover}
          theme={theme}
          t={t}
          draftText={draftCommentText}
          setDraftText={setDraftCommentText}
          onAddComment={handleAddComment}
          isVisible={!commentsPanelOpen}
          onOpenInput={() => setCommentPopover(p => ({ ...p, isInputMode: true }))}
          onClose={() => setCommentPopover(p => ({ ...p, show: false }))}
        />

        <DocContextMenu
          show={contextMenu.show}
          x={contextMenu.x}
          y={contextMenu.y}
          theme={theme}
          t={t}
          onClose={() => setContextMenu({ ...contextMenu, show: false })}
          onCopy={handleContextMenuCopy}
          onAddComment={() => {
            if (!editor) return;
            const { from, to } = editor.state.selection;
            const text = editor.state.doc.textBetween(from, to, ' ');
            const { view } = editor;
            try {
              const startCoords = view.coordsAtPos(from);
              const endCoords = view.coordsAtPos(to);
              setCommentPopover({
                show: true,
                x: (startCoords.left + endCoords.right) / 2,
                y: startCoords.top,
                from,
                to,
                lineText: text,
                isInputMode: true
              });
            } catch (e) { }
          }}
        />

        <AnimatePresence>
          {focusedComment && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex flex-col items-center justify-end pb-12 pointer-events-none">
              <div className="pointer-events-auto flex flex-col items-center gap-4 bg-[#18181b] p-6 rounded-2xl border border-blue-500/50 shadow-2xl max-w-lg text-center mx-4">
                <h3 className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-2"><Check size={16} className="text-blue-500" /> {t('liveDocs.focusMode')}</h3>
                <p className="text-white/70 text-[13px] line-clamp-3 italic">"{focusedComment.text}"</p>
                <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">
                  <span>{focusedComment.authorName}</span><span>&bull;</span><span>{new Date(focusedComment.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mt-2">{t('liveDocs.focusModeInfo') || 'Editing in Focus Mode'}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <CommentsSidebar
          isOpen={commentsPanelOpen} onClose={() => setCommentsPanelOpen(false)}
          comments={comments} theme={theme} currentUser={currentUser} i18n={i18n} t={t}
          editingCommentId={editingCommentId} editCommentText={editCommentText}
          setEditingCommentId={setEditingCommentId} setEditCommentText={setEditCommentText}
          handleEditComment={handleEditComment} handleDeleteComment={handleDeleteComment}
          focusCommentInEditor={focusCommentInEditor} enterFocusMode={enterFocusMode}
          handleAiResolve={handleAiResolve} resolvingCommentId={resolvingCommentId}
          handleAiAccept={handleAiAccept} handleAiReject={handleAiReject}
        />

        <FinalizeDocDialog
          isOpen={finalizeOpen || pendingSignatureOpen}
          onClose={() => {
            setFinalizeOpen(false);
            setPendingSignatureOpen(false);
          }}
          theme={theme}
          t={t}
          i18n={i18n}
          signatureRef={signatureRef}
          isFinalizing={isFinalizing}
          handleFinalize={handleFinalize}
          SignatureComponent={Signature}
          title={pendingSignatureOpen ? (t('liveDocs.pendingSignatureTitle') || 'Signature Required') : t('liveDocs.finalizeDocument')}
          message={pendingSignatureOpen ? (t('liveDocs.pendingSignatureMessage') || 'This document is pending finalization. Please sign to finalize.') : t('liveDocs.finalizeWarning')}
          confirmText={pendingSignatureOpen ? (t('liveDocs.sign') || 'Sign') : (t('liveDocs.confirmSign') || 'Confirm & Sign')}
        />

        {currentUser?.isAdmin && (
          <AiWriterPanel
            editor={editor}
            theme={theme}
            currentUser={currentUser}
            t={t}
          />
        )}
      </div>

      {editor && (
        <LiveDocPrintView
          docMeta={docMeta}
          htmlContent={editor.getHTML()}
          theme={theme}
          t={t}
          i18n={i18n}
          id={id}
        />
      )}
      <ConfirmActionDialog
        isOpen={deleteCommentState.isOpen}
        onClose={() => setDeleteCommentState({ isOpen: false, id: null, isBusy: false })}
        onConfirm={confirmDeleteComment}
        isBusy={deleteCommentState.isBusy}
        theme={theme}
        t={t}
        title={t('liveDocs.deleteComment') || 'Delete Comment'}
        message={t('liveDocs.deleteConfirmMessage') || 'Are you sure you want to permanently delete this comment and its history?'}
        confirmText={t('liveDocs.delete') || 'Delete'}
      />
    </div>
  );
};

export default LiveDocPage;
