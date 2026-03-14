import { db } from '../firebase';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    deleteDoc
} from 'firebase/firestore';


export const saveUserProfile = async (userId, profileData) => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...profileData,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error saving user profile:", error);
        throw error;
    }
};

// Get a user profile by ID
export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

// Delete a user profile
export const deleteUserProfile = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        await deleteDoc(userRef);
        return true;
    } catch (error) {
        console.error("Error deleting user profile:", error);
        throw error;
    }
};

// Get a user profile by username
export const getUserProfileByUsername = async (username) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile by username:", error);
        throw error;
    }
};

// Get all users (useful for client-side search/explore)
export const getAllUsers = async () => {
    try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};



// Create or get an existing 1-on-1 chat
export const createOrGetChat = async (currentUserId, targetUserId) => {
    try {
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('participants', 'array-contains', currentUserId));
        const querySnapshot = await getDocs(q);

        let existingChat = null;
        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.participants && data.participants.includes(targetUserId) && data.participants.length === 2 && !data.isGroup) {
                existingChat = { id: doc.id, ...data };
            }
        });

        if (existingChat) {
            return existingChat;
        }

        // Create new chat
        const newChatRef = await addDoc(chatsRef, {
            participants: [currentUserId, targetUserId],
            isGroup: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastMessage: '',
            lastMessageTime: serverTimestamp()
        });

        return {
            id: newChatRef.id,
            participants: [currentUserId, targetUserId]
        };
    } catch (error) {
        console.error("Error creating or getting chat:", error);
        throw error;
    }
};

// Send a message to a chat
export const sendMessage = async (chatId, senderId, text) => {
    try {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        await addDoc(messagesRef, {
            senderId,
            text,
            createdAt: serverTimestamp(),
            read: false
        });

        // Update the main chat document with the last message
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
            lastMessage: text,
            lastMessageTime: serverTimestamp()
        });

        return true;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

// GROUPS
// Create a new group
export const createGroup = async (groupData, creatorId) => {
    try {
        // 1. Create the Group document
        const groupsRef = collection(db, 'groups');
        const newGroup = await addDoc(groupsRef, {
            name: groupData.name,
            description: groupData.description || '',
            type: groupData.type, // 'CLASS', 'FAMILY', 'WORK'
            privacyMode: groupData.privacyMode || 'PUBLIC',
            creatorId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // 2. Add the creator as the first ADMIN member of the group
        await addGroupMember(newGroup.id, creatorId, 'ADMIN', groupData.userPrivacyMode || 'PUBLIC');

        return newGroup.id;
    } catch (error) {
        console.error("Error creating group:", error);
        throw error;
    }
};

// Add a member to a group
export const addGroupMember = async (groupId, userId, role = 'MEMBER', privacyMode = 'PUBLIC') => {
    try {
        const membersRef = collection(db, 'groupMembers');
        await addDoc(membersRef, {
            groupId,
            userId,
            role, // 'ADMIN' or 'MEMBER'
            privacyMode, // 'PUBLIC' or 'PRIVATE' for this specific member in this group
            joinedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error adding group member:", error);
        throw error;
    }
};

// Get groups a user belongs to
export const getUserGroups = async (userId) => {
    try {
        const membersRef = collection(db, 'groupMembers');
        const q = query(membersRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const groupPromises = querySnapshot.docs.map(async (memberDoc) => {
            const memberData = memberDoc.data();
            const groupRef = doc(db, 'groups', memberData.groupId);
            const groupSnap = await getDoc(groupRef);
            if (groupSnap.exists()) {
                return {
                    id: groupSnap.id,
                    ...groupSnap.data(),
                    memberInfo: { id: memberDoc.id, ...memberData }
                };
            }
            return null;
        });

        const groups = await Promise.all(groupPromises);
        return groups.filter(g => g !== null);
    } catch (error) {
        console.error("Error fetching user groups:", error);
        throw error;
    }
};

// Get members of a specific group
export const getGroupMembers = async (groupId) => {
    try {
        const membersRef = collection(db, 'groupMembers');
        const q = query(membersRef, where("groupId", "==", groupId));
        const querySnapshot = await getDocs(q);

        const memberPromises = querySnapshot.docs.map(async (memberDoc) => {
            const memberData = memberDoc.data();
            const userProfile = await getUserProfile(memberData.userId);
            return {
                id: memberDoc.id,
                ...memberData,
                profile: userProfile || { id: memberData.userId, displayName: 'Unknown User' }
            };
        });

        return await Promise.all(memberPromises);
    } catch (error) {
        console.error("Error fetching group members:", error);
        throw error;
    }
};

export const getGroupInfo = async (groupId) => {
    try {
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
            return { id: groupSnap.id, ...groupSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching group info:", error);
        throw error;
    }
};

export const sendGroupMessage = async (groupId, senderId, text) => {
    try {
        const messagesRef = collection(db, 'groups', groupId, 'messages');
        await addDoc(messagesRef, {
            senderId,
            text,
            createdAt: serverTimestamp()
        });

        const groupRef = doc(db, 'groups', groupId);
        await updateDoc(groupRef, {
            lastMessage: text,
            lastMessageTime: serverTimestamp()
        });

        return true;
    } catch (error) {
        console.error("Error sending group message:", error);
        throw error;
    }
};
