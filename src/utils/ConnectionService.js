import { db } from "../firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";

/**
 * Sends a connection request from one user to another.
 * @param {string} senderId The UID of the sender.
 * @param {string} receiverId The UID of the receiver.
 */
export async function sendConnectionRequest(senderId, receiverId) {
  if (!senderId || !receiverId) return;
  
  try {
    const connectionsRef = collection(db, "connections");
    // Check if a connection already exists
    const q1 = query(connectionsRef, where("senderId", "==", senderId), where("receiverId", "==", receiverId));
    const snap1 = await getDocs(q1);
    const q2 = query(connectionsRef, where("senderId", "==", receiverId), where("receiverId", "==", senderId));
    const snap2 = await getDocs(q2);
    
    if (!snap1.empty || !snap2.empty) {
      console.log("ConnectionRequest: Already exists");
      return;
    }
    
    await addDoc(connectionsRef, {
      senderId,
      receiverId,
      status: "pending",
      createdAt: serverTimestamp()
    });
    console.log("ConnectionRequest: Sent successfully");
  } catch (err) {
    console.error("ConnectionService: Error sending request", err);
  }
}

/**
 * Fetches all connection requests (pending) for current user.
 * @param {string} userId Current user's UID.
 */
export async function getPendingRequests(userId) {
  try {
    const connectionsRef = collection(db, "connections");
    const q = query(connectionsRef, where("receiverId", "==", userId), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    
    // We need to fetch the sender's user info too
    const requests = [];
    for (const d of querySnapshot.docs) {
      const connData = d.data();
      const userRef = doc(db, "users", connData.senderId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        requests.push({ id: d.id, ...connData, senderInfo: userSnap.data() });
      }
    }
    return requests;
  } catch (err) {
    console.error("ConnectionService: Error fetching requests", err);
    return [];
  }
}

/**
 * Accepts a connection request.
 * @param {string} requestId The Firestore doc ID of the connection.
 */
export async function acceptRequest(requestId) {
  try {
    const requestRef = doc(db, "connections", requestId);
    await updateDoc(requestRef, {
      status: "accepted",
      acceptedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("ConnectionService: Error accepting request", err);
  }
}

/**
 * Gets all accepted connections (friends) for a user.
 * @param {string} userId Current user's UID.
 */
export async function getAcceptedConnections(userId) {
    try {
      const connectionsRef = collection(db, "connections");
      const q1 = query(connectionsRef, where("senderId", "==", userId), where("status", "==", "accepted"));
      const q2 = query(connectionsRef, where("receiverId", "==", userId), where("status", "==", "accepted"));
      
      const snap1 = await getDocs(q1);
      const snap2 = await getDocs(q2);
      
      const connections = [];
      const userIds = new Set();
      
      snap1.forEach(d => {
        userIds.add(d.data().receiverId);
      });
      snap2.forEach(d => {
        userIds.add(d.data().senderId);
      });
      
      for (const id of userIds) {
        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          connections.push(userSnap.data());
        }
      }
      return connections;
    } catch (err) {
      console.error("ConnectionService: Error fetching connections", err);
      return [];
    }
}

/**
 * Fetches all outgoing connection requests sent by current user.
 * @param {string} userId Current user's UID.
 */
export async function getSentRequests(userId) {
  try {
    const connectionsRef = collection(db, "connections");
    const q = query(connectionsRef, where("senderId", "==", userId), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("ConnectionService: Error fetching sent requests", err);
    return [];
  }
}

/**
 * Cancels or deletes a connection request.
 * @param {string} requestId 
 */
export async function cancelRequest(requestId) {
  try {
    const requestRef = doc(db, "connections", requestId);
    await deleteDoc(requestRef);
  } catch (err) {
    console.error("ConnectionService: Error cancelling request", err);
  }
}
