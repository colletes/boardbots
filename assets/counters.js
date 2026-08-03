// Board Bots — visitor count + per-bot like/dislike, backed by Firebase Firestore.
// Firestore security rules (see firestore.rules) restrict public writes to a
// safe +1/-1 increment on the `count` field only — no auth/login needed, and
// this client config is not a secret (access control lives in the rules, not
// in hiding this key). Fill in REPLACE_WITH_* below with your Firebase project's
// web app config (Firebase console → Project settings → Your apps).
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { initializeFirestore, doc, getDoc, setDoc, increment } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBtqtwZvQeG9cz0Vqd2J0MqPGO4mGeL-B8',
  authDomain: 'boardbots-641cc.firebaseapp.com',
  projectId: 'boardbots-641cc',
  storageBucket: 'boardbots-641cc.firebasestorage.app',
  messagingSenderId: '567514929457',
  appId: '1:567514929457:web:f04172437b22deeae07810'
};

// Placeholder config short-circuits to "not configured" so the widgets degrade
// cleanly instead of retrying forever against a bogus Firebase project.
const CONFIGURED = !firebaseConfig.apiKey.startsWith('REPLACE_WITH_');
const app = CONFIGURED ? initializeApp(firebaseConfig) : null;
// Auto-detect long-polling: some networks/browsers block Firestore's default
// WebChannel streaming transport, causing requests to hang indefinitely.
const db = CONFIGURED ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true }) : null;
const VOTE_KEY_PREFIX = 'boardbots_vote_';

// Applies a +1/-1 delta and returns the resulting count.
async function bump(counterId, delta){
  if (!CONFIGURED) throw new Error('Firebase not configured yet');
  const ref = doc(db, 'counters', counterId);
  await setDoc(ref, { count: increment(delta) }, { merge: true });
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data().count || 0) : 0;
}

async function readCount(counterId){
  if (!CONFIGURED) throw new Error('Firebase not configured yet');
  const snap = await getDoc(doc(db, 'counters', counterId));
  return snap.exists() ? (snap.data().count || 0) : 0;
}

function formatCount(n){
  const lang = localStorage.getItem('boardbots_lang') || 'pt';
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'pt-BR').format(n);
}

async function initVisitCounter(){
  const badge = document.getElementById('visitBadge');
  const el = document.getElementById('visitCount');
  if (!el) return;
  try {
    const count = await bump('site-visits', 1);
    el.textContent = formatCount(count);
  } catch (e) {
    console.warn('Board Bots: visit counter failed', e);
    badge?.classList.add('hidden');
  }
}

async function castVote(bot, choice, likeBtn, dislikeBtn, likeCountEl, dislikeCountEl){
  const votedKey = VOTE_KEY_PREFIX + bot;
  const current = localStorage.getItem(votedKey);
  if (current === choice) return;

  likeBtn.disabled = true;
  dislikeBtn.disabled = true;
  try {
    if (current) {
      const undoCount = await bump(`${current}-${bot}`, -1);
      (current === 'like' ? likeCountEl : dislikeCountEl).textContent = formatCount(undoCount);
    }
    const newCount = await bump(`${choice}-${bot}`, 1);
    (choice === 'like' ? likeCountEl : dislikeCountEl).textContent = formatCount(newCount);
    localStorage.setItem(votedKey, choice);
    likeBtn.classList.toggle('voted', choice === 'like');
    dislikeBtn.classList.toggle('voted', choice === 'dislike');
  } catch (e) {
    console.warn('Board Bots: vote request failed', e);
  } finally {
    likeBtn.disabled = false;
    dislikeBtn.disabled = false;
  }
}

async function initVoteButtons(){
  const groups = document.querySelectorAll('.game-card-actions[data-bot]');
  for (const group of groups) {
    const bot = group.dataset.bot;
    const likeBtn = group.querySelector('.vote-btn.like');
    const dislikeBtn = group.querySelector('.vote-btn.dislike');
    const likeCountEl = group.querySelector('.like-count');
    const dislikeCountEl = group.querySelector('.dislike-count');
    const voted = localStorage.getItem(VOTE_KEY_PREFIX + bot);

    try {
      const [likeCount, dislikeCount] = await Promise.all([
        readCount(`like-${bot}`),
        readCount(`dislike-${bot}`)
      ]);
      likeCountEl.textContent = formatCount(likeCount);
      dislikeCountEl.textContent = formatCount(dislikeCount);
    } catch (e) {
      likeCountEl.textContent = '–';
      dislikeCountEl.textContent = '–';
    }

    if (voted === 'like') likeBtn.classList.add('voted');
    if (voted === 'dislike') dislikeBtn.classList.add('voted');

    likeBtn.addEventListener('click', () => castVote(bot, 'like', likeBtn, dislikeBtn, likeCountEl, dislikeCountEl));
    dislikeBtn.addEventListener('click', () => castVote(bot, 'dislike', likeBtn, dislikeBtn, likeCountEl, dislikeCountEl));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initVisitCounter();
  initVoteButtons();
});
