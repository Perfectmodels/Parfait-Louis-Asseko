// src/hooks/useMessages.ts
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
  getDoc,
  setDoc,
  DocumentData,
  writeBatch
} from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../lib/firebase';

export type InternalMessage = {
  id?: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  content?: string;
  attachments?: { name: string; url: string; contentType?: string }[];
  timestamp?: any;
  isRead?: boolean;
  messageType?: 'text' | 'file' | 'image';
  typing?: boolean;
};

export type ConversationMeta = {
  id: string;
  participants: string[]; // [userA, userB]
  lastMessage?: InternalMessage;
  unreadCount: number;
  updatedAt?: any;
  displayName?: string;
  userRole?: string;
};

export const useMessages = (currentUserId: string) => {
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);

  // Listen all messages where user is participant (sender OR recipient)
  useEffect(() => {
    if (!currentUserId) return;

    // conversations collection
    const convsQ = query(
      collection(firestore, 'conversations'),
      where('participants', 'array-contains', currentUserId),
      orderBy('updatedAt', 'desc')
    );

    const unsubConvs = onSnapshot(convsQ, snapshot => {
      const convs: ConversationMeta[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        convs.push({
          id: docSnap.id,
          participants: data.participants,
          lastMessage: data.lastMessage,
          unreadCount: (data.unreadMap && data.unreadMap[currentUserId]) || 0,
          updatedAt: data.updatedAt,
          displayName: data.displayName,
          userRole: data.userRole
        });
      });
      setConversations(convs);
    });

    // Store unsubscribe function for cleanup

    return () => {
      unsubConvs();
    };
  }, [currentUserId]);

  // subscribe to messages of a specific conversation (we expose a helper instead)
  const subscribeToConversation = useCallback((conversationId: string, onUpdate: (msgs: InternalMessage[]) => void) => {
    if (!conversationId) return () => {};
    const messagesQ = query(
      collection(firestore, `conversations/${conversationId}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsub = onSnapshot(messagesQ, snapshot => {
      const msgs: InternalMessage[] = [];
      snapshot.forEach(d => {
        msgs.push({ id: d.id, ...(d.data() as DocumentData) } as InternalMessage);
      });
      onUpdate(msgs);
    });

    return unsub;
  }, []);

  // create new conversation (if not exists) — returns convId
  const createConversationIfNotExists = useCallback(async (userA: string, userB: string, meta?: { [k: string]: any }) => {
    // conversation id deterministic for 1:1 => sort ids
    const ordered = [userA, userB].sort();
    const convId = ordered.join('_');

    const convRef = doc(firestore, 'conversations', convId);
    const convSnap = await getDoc(convRef);
    if (!convSnap.exists()) {
      await setDoc(convRef, {
        participants: ordered,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: null,
        unreadMap: { [userA]: 0, [userB]: 0 },
        ...meta
      });
    }
    return convId;
  }, []);

  // send message, optionally with files
  const sendMessage = useCallback(async (conversationId: string, message: Partial<InternalMessage>, files?: File[]) => {
    const msgsCol = collection(firestore, `conversations/${conversationId}/messages`);

    // handle file uploads to storage
    let attachments: InternalMessage['attachments'] | undefined = undefined;
    if (files && files.length) {
      attachments = [];
      for (const file of files) {
        const path = `conversations/${conversationId}/attachments/${Date.now()}_${file.name}`;
        const sRef = storageRef(storage, path);
        const uploadTask = uploadBytesResumable(sRef, file);
        // wait for upload
        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed', null, (err) => reject(err), async () => {
            const url = await getDownloadURL(sRef);
            attachments!.push({ name: file.name, url, contentType: file.type });
            resolve();
          });
        });
      }
    }

    // Add doc
    const docRef = await addDoc(msgsCol, {
      ...message,
      attachments: attachments || [],
      timestamp: serverTimestamp(),
      isRead: false
    });

    // Update conversation lastMessage & unread counts atomically
    const convRef = doc(firestore, 'conversations', conversationId);
    const convSnap = await getDoc(convRef);
    const batch = writeBatch(firestore);
    const lastMessage = {
      id: docRef.id,
      ...message,
      attachments: attachments || [],
      timestamp: serverTimestamp(),
    };

    // Compute unreadMap by incrementing recipient unread count
    const convData = convSnap.exists() ? convSnap.data() : { participants: [] as string[], unreadMap: {} };
    const unreadMap = { ...(convData.unreadMap || {}) };
    // recipient(s) = participants excluding sender
    const participants: string[] = convData.participants || [];
    const senderId = message.senderId!;
    participants.forEach(p => {
      if (p !== senderId) {
        unreadMap[p] = (unreadMap[p] || 0) + 1;
      }
    });

    batch.update(convRef, {
      lastMessage,
      updatedAt: serverTimestamp(),
      unreadMap
    });

    await batch.commit();
    return docRef.id;
  }, []);

  // mark messages read (and reset unread count for current user)
  const markConversationAsRead = useCallback(async (conversationId: string, readerId: string) => {
    // set unreadMap[readerId] = 0 on conversation doc
    const convRef = doc(firestore, 'conversations', conversationId);
    await updateDoc(convRef, {
      [`unreadMap.${readerId}`]: 0
    });

    // optionally mark every message as read (for auditing)
    // we will not mass-update each message for performance — rely on unreadMap
  }, []);

  // set typing indicator: store ephemeral doc in "conversations/{convId}/presence/{userId}"
  const setTyping = useCallback(async (conversationId: string, userId: string, isTyping: boolean) => {
    const presenceRef = doc(firestore, `conversations/${conversationId}/presence`, userId);
    await setDoc(presenceRef, { typing: isTyping, updatedAt: serverTimestamp() }, { merge: true });
  }, []);

  // expose helpers
  return {
    messages,
    setMessages,
    conversations,
    subscribeToConversation,
    createConversationIfNotExists,
    sendMessage,
    markConversationAsRead,
    setTyping
  };
};
