import { firestore, db as realTimeDb, auth } from './firebaseConfig';

// Default export 'db' for Firestore (used by new MissOneLight pages)
export const db = firestore;

// Export RTDB as rtdb
export const rtdb = realTimeDb;

// Export Firebase Auth
export { auth };
