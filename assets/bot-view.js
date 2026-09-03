// Board Bots — per-bot page-view counter, write-only (not shown in the UI,
// only visible in Firebase Console under Firestore → counters → view-{bot}).
import { initializeFirestore, doc, setDoc, increment } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { app, CONFIGURED } from './firebase-init.js';

const FILE_TO_BOT = {
  'stone_age_bot.html': 'stoneage',
  'hoth_bot.html': 'hoth',
  'Heroscape_bot.html': 'heroscape',
  'Mystic_Vale_bot.html': 'mysticvale',
  'mick_bot.html': 'mick',
  'thunder_road_vendetta_bot.html': 'trv',
  'utek_bot.html': 'utek',
  'cafe_baras_bot.html': 'cafebaras',
  'arknova_arno_bot.html': 'arknova',
  'sanctuary_bot.html': 'sanctuary',
  'eleven_bot.html': 'eleven',
  'memoir44_bot.html': 'memoir44',
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
