// Board Bots — receives BuyMeACoffee (BMC) webhook events and mirrors the
// "someone just supported you" ones into Firestore's `supporters` collection,
// so the static site (assets/supporters.js) can show a rolling public feed
// without ever calling BMC's API from the browser (which BMC's own docs say
// isn't supported for client-side JS) or embedding their page in an iframe
// (blocked by their `X-Frame-Options: SAMEORIGIN` header).
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

// Set via: firebase functions:secrets:set BMC_WEBHOOK_SECRET
// (value = the "Signing Secret" shown on the webhook's detail page in the
// BMC creator dashboard under Integrations -> Webhooks). Never hardcode it.
const BMC_WEBHOOK_SECRET = defineSecret('BMC_WEBHOOK_SECRET');

// Only "something new happened" events count as a supporter entry — refunds,
// updates, cancellations and pauses are ignored so the feed only ever grows
// with genuine new support.
const SUPPORTER_EVENT_TYPES = new Set([
  'donation.created',
  'extra_purchase.created',
  'commission_order.created',
  'wishlist_payment.created',
  'membership.started',
  'recurring_donation.started'
]);

const MAX_SUPPORTERS = 20;

exports.bmcWebhook = onRequest(
  { secrets: [BMC_WEBHOOK_SECRET], cors: false },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const signature = req.get('x-signature-sha256');
    const rawBody = req.rawBody;
    if (!signature || !rawBody) {
      res.status(400).send('Missing signature');
      return;
    }

    const expected = crypto.createHmac('sha256', BMC_WEBHOOK_SECRET.value()).update(rawBody).digest('hex');
    let validSignature = false;
    try {
      const sigBuf = Buffer.from(signature, 'hex');
      const expBuf = Buffer.from(expected, 'hex');
      validSignature = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
    } catch {
      validSignature = false;
    }
    if (!validSignature) {
      logger.warn('bmcWebhook: rejected request with invalid signature');
      res.status(401).send('Invalid signature');
      return;
    }

    const event = req.body;
    if (!event || !event.type || event.live_mode === false || !SUPPORTER_EVENT_TYPES.has(event.type)) {
      res.status(200).send('Ignored');
      return;
    }

    const data = event.data || {};
    if (data.refunded === 'true' || data.status === 'refunded') {
      res.status(200).send('Ignored refund');
      return;
    }

    // Doc ID = event_id so BMC's automatic retries (on non-2xx responses)
    // never create duplicate supporter entries.
    await db.collection('supporters').doc(String(event.event_id)).set({
      name: String(data.supporter_name || 'Anonymous').slice(0, 60),
      type: event.type,
      coffeeCount: typeof data.coffee_count === 'number' ? data.coffee_count : null,
      amount: typeof data.amount === 'number' ? data.amount : null,
      currency: data.currency || null,
      membershipLevel: data.membership_level_name || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await trimOldSupporters();

    res.status(200).send('OK');
  }
);

async function trimOldSupporters(){
  const snap = await db.collection('supporters').orderBy('createdAt', 'desc').offset(MAX_SUPPORTERS).get();
  if (snap.empty) return;
  const batch = db.batch();
  snap.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
}
