import { db } from "../firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

/**
 * Generic discovery with optional filters.
 * If no filters are provided, it returns a broad list of users.
 * @param {string} currentUserId Current user's UID to exclude.
 * @param {object} filters { college: string, company: string }
 */
export async function discoverProfiles(currentUserId, filters = {}) {
  try {
    const usersRef = collection(db, "users");
    let q;
    
    if (filters.college) {
      q = query(usersRef, where("primaryCollege", "==", filters.college), limit(50));
    } else if (filters.company) {
      q = query(usersRef, where("currentCompany", "==", filters.company), limit(50));
    } else {
      // Default: show anyone
      q = query(usersRef, limit(100));
    }
    
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.uid !== currentUserId) {
        results.push(data);
      }
    });
    
    // Simple shuffle for "at least few people" variety
    return results.sort(() => Math.random() - 0.5);
  } catch (err) {
    console.error("DiscoveryService: Error discovery profiles", err);
    return [];
  }
}

/**
 * Gets overall network statistics (distribution of colleges/cities).
 */
export async function getNetworkStats() {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(query(usersRef, limit(200)));
      
      const collegeDist = {};
      const cityDist = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.primaryCollege) {
          collegeDist[data.primaryCollege] = (collegeDist[data.primaryCollege] || 0) + 1;
        }
        if (data.location) {
          cityDist[data.location] = (cityDist[data.location] || 0) + 1;
        }
      });
  
      const formatDist = (dist) => Object.entries(dist)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
  
      return {
        colleges: formatDist(collegeDist),
        locations: formatDist(cityDist)
      };
    } catch (err) {
      console.error("DiscoveryService: Error fetching stats", err);
      return { colleges: [], locations: [] };
    }
  }
