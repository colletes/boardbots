// Board Bots — per-bot page-view counter, write-only (not shown in the UI,
// only visible in Firebase Console under Firestore → counters → view-{bot}).
import { initializeFirestore, doc, setDoc, increment } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { app, CONFIGURED } from './firebase-init.js';

const FILE_TO_BOT = {
  'stone_age_bot_v2.html': 'stoneage',
  'Colletes-hoth_bot_RC8.html': 'hoth',
  'Heroscape_bot_v2.html': 'heroscape',
  'Mystic_Vale_bot_v02.html': 'mysticvale',
  'mick_bot_RC2.html': 'mick',
  'Colletes-bot-trv-RC2.html': 'trv',
  'utek_bot_v2.html': 'utek',
  'cafe_baras_bot_v1.html': 'cafebaras',
  'arknova_arno_bot_v1.html': 'arknova',
  'sanctuary_bot_v2.html': 'sanctuary',
  'eleven_bot_v1.html': 'eleven',
  'memoir44_bot_v3.html': 'memoir44',
  'dice_roller_v1.html': 'tool-dice',
  'point_counter_v1.html': 'tool-pointcounter'
};

if (CONFIGURED) {
  const bot = FILE_TO_BOT[location.pathname.split('/').pop()];
  if (bot) {
    const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
    setDoc(doc(db, 'counters', `view-${bot}`), { count: increment(1) }, { merge: true })
      .catch(e => console.warn('Board Bots: view counter failed', e));
  }
}
