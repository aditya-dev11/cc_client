import { db } from "../firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore";

/**
 * Sends a message from one user to another.
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} text 
 */
export async function sendMessage(senderId, receiverId, text) {
  if (!senderId || !receiverId || !text) return;
  
  try {
    const messagesRef = collection(db, "messages");
    await addDoc(messagesRef, {
      senderId,
      receiverId,
      text,
      createdAt: serverTimestamp(),
      participants: [senderId, receiverId].sort((a,b) => a.localeCompare(b)) // For easy querying of a specific chat
    });
    console.log("MessagingService: Message sent successfully");
  } catch (err) {
    console.error("MessagingService: Error sending message", err);
  }
}

/**
 * Subscribes to real-time messages between two users.
 * @param {string} user1Id 
 * @param {string} user2Id 
 * @param {Function} callback 
 */
export function subscribeToConversation(user1Id, user2Id, callback) {
  const participants = [user1Id, user2Id].sort((a,b) => a.localeCompare(b));
  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef, 
    where("participants", "==", participants),
    orderBy("createdAt", "asc"),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    callback(messages);
  }, (err) => {
    console.error("MessagingService: Subscription error", err);
  });
}

/**
 * Fetches recent messages between two users.
 * @param {string} user1Id 
 * @param {string} user2Id 
 */
export async function getConversation(user1Id, user2Id) {
    try {
      const messagesRef = collection(db, "messages");
      const participants = [user1Id, user2Id].sort((a,b) => a.localeCompare(b));
      const q = query(
        messagesRef, 
        where("participants", "==", participants),
        orderBy("createdAt", "asc"),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      return messages;
    } catch (err) {
      console.error("MessagingService: Error fetching conversation", err);
      return [];
    }
}

/**
 * Fetches the user's latest chats (most recent message with each unique user).
 * @param {string} userId 
 */
export async function getRecentChats(userId) {
  // Simplified version: Fetch all messages where participant is userId
  try {
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef, 
      where("participants", "array-contains", userId),
      orderBy("createdAt", "desc"),
      limit(100)
    );
    
    const querySnapshot = await getDocs(q);
    const chats = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const otherUserId = data.participants.find(id => id !== userId);
      if (otherUserId && !chats[otherUserId]) {
        chats[otherUserId] = data;
      }
    });
    
    // Convert to list and fetch other user names/avatars?
    // We'll leave that to the component for now.
    return Object.entries(chats).map(([otherUserId, message]) => ({ otherUserId, lastMessage: message }));
  } catch (err) {
    console.error("MessagingService: Error fetching recent chats", err);
    return [];
  }
}
