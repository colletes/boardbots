// Board Bots — page-view analytics via Firebase Analytics (GA4), loaded on
// every page as a single source of metrics (replaces GoatCounter). GA4's
// default "enhanced measurement" logs a page_view automatically on load, so
// no manual event calls are needed here.
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js';
import { app, ANALYTICS_CONFIGURED } from './firebase-init.js';

if (ANALYTICS_CONFIGURED) {
  getAnalytics(app);
}
