// Board Bots — shared Firebase app init, used by both counters.js (Firestore)
// and analytics.js (Analytics) so the app is only initialized once even when
// both scripts load on the same page.
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';

export const firebaseConfig = {
  apiKey: 'AIzaSyBtqtwZvQeG9cz0Vqd2J0MqPGO4mGeL-B8',
  authDomain: 'boardbots-641cc.firebaseapp.com',
  projectId: 'boardbots-641cc',
  storageBucket: 'boardbots-641cc.firebasestorage.app',
  messagingSenderId: '567514929457',
  appId: '1:567514929457:web:f04172437b22deeae07810',
  measurementId: 'G-KC7L60CK63'
};

// Placeholder config short-circuits to "not configured" so widgets degrade
// cleanly instead of retrying forever against a bogus Firebase project.
export const CONFIGURED = !firebaseConfig.apiKey.startsWith('REPLACE_WITH_');
export const ANALYTICS_CONFIGURED = CONFIGURED && !firebaseConfig.measurementId.startsWith('REPLACE_WITH_');
export const app = CONFIGURED ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
