import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface StrategyRecord {
  id: string;
  walletAddress: string;
  isPremium: boolean;
  context: {
    background: string;
    industry: string;
    goals: string;
    currentPosition: string;
  };
  strategy: Record<string, unknown>;
  createdAt: Date;
}

export async function saveStrategy(
  walletAddress: string,
  isPremium: boolean,
  context: StrategyRecord['context'],
  strategy: Record<string, unknown>
): Promise<string> {
  const docRef = await addDoc(collection(db, 'strategies'), {
    walletAddress,
    isPremium,
    context,
    strategy,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getStrategyHistory(walletAddress: string): Promise<StrategyRecord[]> {
  try {
    // Query hanya pakai where tanpa orderBy supaya tidak butuh composite index
    const q = query(
      collection(db, 'strategies'),
      where('walletAddress', '==', walletAddress),
      limit(50)
    );

    const snapshot = await getDocs(q);
    const records = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        walletAddress: data.walletAddress,
        isPremium: data.isPremium ?? false,
        context: data.context,
        strategy: data.strategy,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(),
      };
    });

    // Sort di client-side — terbaru dulu
    return records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (err) {
    console.error('[AetherOS] Firestore query error:', err);
    throw err;
  }
}

export async function deleteStrategy(docId: string): Promise<void> {
  await deleteDoc(doc(db, 'strategies', docId));
}
